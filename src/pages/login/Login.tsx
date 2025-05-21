import { useState, useRef, useCallback, useContext } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../../components';
import { FaUser } from "react-icons/fa";
import { AuthContext } from '../../contexts/AuthContext';
import './login.scss';

export default function LoginAluno() {
    const { login, responseError, setResponseError } = useContext(AuthContext)!;
    const webcamRef = useRef<Webcam>(null);

    const [isCameraOn, setIsCameraOn] = useState(true);
    const [image, setImage] = useState<string | null>(null);

    const onStart = () => {
        setIsCameraOn(true);
    }

    const onCancel = () => {
        setIsCameraOn(false);
        setImage(null);
    }

    const onCapture = useCallback(() => {
        setResponseError(null);
        const screenshot = webcamRef.current?.getScreenshot();
        if (screenshot) {
            setImage(screenshot);
            login(screenshot);
        }
    }, [webcamRef]);

    return (
        <main className="login-container">
            <h1 className='login-title'>Verifique sua identidade</h1>
            {responseError && <p className="response-error">Ocorreu uma falha: {responseError}</p>}

            <div className="camera-container">
                {
                    image ? <img src={image} alt="Imagem Capturada" className='cam-img' />
                        : !isCameraOn ? <FaUser className='user-icon' />
                            : <Webcam
                                mirrored
                                audio={false}
                                ref={webcamRef}
                                className='cam-img'
                                screenshotFormat='image/jpeg'
                                videoConstraints={{ facingMode: 'user' }}
                            />
                }
            </div>

            <div className="right-col">
                {!isCameraOn ?
                    <>
                        <Button text='Iniciar Reconhecimento' onClick={onStart} />
                        <Button text='Solicitar Acesso Especial' type='outlined' onClick={() => { }} />
                    </>
                    : <>
                        {
                            !image ? <Button text='Capturar' onClick={onCapture} />
                                : <Button text='Tirar Outra' onClick={() => { setImage(null) }} />
                        }
                        <Button text='Cancelar' type='cancel' onClick={onCancel} />
                    </>
                }
            </div>

        </main>
    )
}