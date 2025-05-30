import React, { useEffect, useRef, useState } from "react";

interface FaceCaptureProps {
    userId: string;
    wsUrl?: string; // exemplo: ws://localhost:8000/usuario/ws/cadastrar-face
}

const FaceCapture: React.FC<FaceCaptureProps> = ({
    userId,
    wsUrl = "ws://localhost:8000/usuario/ws/cadastrar-face",
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [message, setMessage] = useState("Clique em iniciar.");
    const [capturing, setCapturing] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const intervalRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCapture = async () => {
        const video = videoRef.current;
        if (!video) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            video.srcObject = stream;

            const socket = new WebSocket(`${wsUrl}?id_usuario=${userId}`);
            socket.binaryType = "arraybuffer";
            socketRef.current = socket;

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                setMessage("Erro ao obter o contexto do canvas.");
                return;
            }

            socket.onmessage = (event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("Mensagem do WebSocket:", data);

                    if (data.status === "success") {
                        setMessage("✅ Cadastro facial concluído!");
                        stopCapture();
                    } else if (data.status === "error") {
                        setMessage(`❌ ${data.message}`);
                    } else if (data.status === "waiting") {
                        setMessage(`⌛ ${data.message}`);
                    } else if (data.face) {
                        setMessage(`🧠 Rosto detectado. Aguarde...`);
                    } else {
                        setMessage("📡 Aguardando detecção...");
                    }
                } catch (err) {
                    console.error("Erro ao processar mensagem:", err);
                }
            };

            const sendFrame = () => {
                if (!video || socket.readyState !== WebSocket.OPEN) return;

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        blob.arrayBuffer().then((buffer) => {
                            socket.send(buffer);
                        });
                    }
                }, "image/jpeg");
            };

            intervalRef.current = window.setInterval(sendFrame, 500);
            setCapturing(true);
            setMessage("🎥 Enviando vídeo para reconhecimento facial...");
        } catch (err) {
            console.error("Erro ao acessar a câmera:", err);
            setMessage("Erro ao acessar a câmera.");
        }
    };

    const stopCapture = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        socketRef.current?.close();
        streamRef.current?.getTracks().forEach((track) => track.stop());
        setCapturing(false);
    };

    useEffect(() => {
        return () => {
            stopCapture();
        };
    }, []);

    return (
        <div>
            <h2>Cadastro Facial</h2>
            <video ref={videoRef} autoPlay playsInline width={640} height={480} />
            <p>{message}</p>
            {!capturing ? (
                <button onClick={startCapture}>Iniciar Captura</button>
            ) : (
                <button onClick={stopCapture}>Parar Captura</button>
            )}
        </div>
    );
};

export default FaceCapture;
