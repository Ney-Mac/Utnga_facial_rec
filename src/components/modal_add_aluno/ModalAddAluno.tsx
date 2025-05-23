import { useState, useContext, useRef, useCallback } from 'react';
import { TextInput, Button } from '../';
import { LoadContext } from '../../contexts/LoadContext';
import Webcam from 'react-webcam';
import { FaUser } from "react-icons/fa";

import './modalAddAluno.scss';

import { API_URL } from '../../settings';
import axios from 'axios';

type Props = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    idLabel: string;
}

type InputType = {
    value: string;
    error: string;
}

export default function ModalAddAluno({ show, setShow, idLabel }: Props) {
    const [responseError, setResponseError] = useState('');
    const { setIsLoading } = useContext(LoadContext);

    const webcamRef = useRef<Webcam>(null);
    const [isCameraOn] = useState(true);
    const [image, setImage] = useState<string>('');

    const [idAluno, setIdAluno] = useState<InputType>({ value: '', error: '' });

    const onClose = () => {
        setResponseError('');
        setShow(false);
        setImage('');
        setIdAluno({ value: '', error: '' })
    }

    const stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation();
    }

    const registrarAluno = async () => {
        try {
            setIsLoading?.(true);

            const byteString = atob(image.split(',')[1]);
            const mimeString = image.split(',')[0].split(':')[1].split(';')[0];

            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([ab], { type: mimeString });
            const file = new File([blob], "capture.jpeg", { type: mimeString });

            let tipo = idLabel === "Aluno"? 'aluno' : idLabel === 'Professor'? 'prof' : 'adm'

            const formData = new FormData();
            formData.append('image', file);
            formData.append("id_usuario", idAluno.value);
            formData.append("tipo", tipo)

            const res = await axios.post(`${API_URL}usuario/registrar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log(res.data);
            setShow(false);
        } catch (error: any) {
            console.log(`Erro ao registrar aluno: ${error}`);
            if (error.response.status <= 500) {
                setResponseError(error.response.data.message)
            } else {
                setResponseError("Opps! Ocorreu algum erro.")
            }
        } finally {
            setIsLoading?.(false);
        }
    }

    const onRegister = () => {
        const idError = idAluno.value === '' ? '*Campo obrigatorio.' : '';
        
        if (idError) {
            setIdAluno({ ...idAluno, error: idError });
            return;
        }

        registrarAluno();
    }

    const onCapture = useCallback(() => {
        setResponseError('');
        const screenshot = webcamRef.current?.getScreenshot();
        if (screenshot) {
            setImage(screenshot);
        }

        if (idAluno.value) registrarAluno();
    }, [webcamRef]);

    return (
        <>{
            show && <div className="modal-add-aluno" onClick={onClose}>
                <div className="container" onClick={stopPropagation}>
                    {responseError && <p className="response-error">Ocorreu uma falha: {responseError}</p>}

                    <div className="row">
                        <TextInput
                            label={`Digite o id do ${idLabel}:`}
                            placeholder='Id'
                            value={idAluno.value}
                            changeValue={(value) => { setIdAluno({ value: value, error: '' }) }}
                            errorText={idAluno.error}
                        />
                    </div>

                    <div className="row-cam">
                        <p className="label">Capturar imagem</p>
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
                    </div>

                    <div className="row">
                        <Button
                            text='Cancelar'
                            type='cancel'
                            onClick={onClose}
                        />

                        <Button
                            text={`${image ? 'Registrar' : 'Capturar'}`}
                            type='contained'
                            onClick={() => { !image ? onCapture() : onRegister() }}
                        />
                    </div>
                </div>
            </div>
        }</>
    )
}