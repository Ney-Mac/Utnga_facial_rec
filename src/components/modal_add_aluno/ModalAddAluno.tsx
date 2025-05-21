import { useState, useContext } from 'react';
import { TextInput, Button, InputFile } from '../';
import { LoadContext } from '../../contexts/LoadContext';

import './modalAddAluno.scss';

import { API_URL } from '../../settings';
import axios from 'axios';

type Props = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

type InputType = {
    value: string;
    error: string;
}

export default function ModalAddAluno({ show, setShow }: Props) {
    const [nome, setNome] = useState<InputType>({ value: '', error: '' });
    const [matricula, setMatricula] = useState<InputType>({ value: '', error: '' });
    const [anoLetivo, setAnoLetivo] = useState<InputType>({ value: '', error: '' });
    const [curso, setCurso] = useState<InputType>({ value: '', error: '' });
    const [turma, setTurma] = useState<InputType>({ value: '', error: '' });
    const [image, setImage] = useState<InputType>({ value: '', error: '' });

    const [responseError, setResponseError] = useState('');

    const { setIsLoading } = useContext(LoadContext);

    const onClose = () => {
        setShow(false);
    }

    const stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation();
    }

    const loadFile = (file: File | undefined) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage({ value: reader.result as string, error: '' })
            };
            reader.readAsDataURL(file);
        }
    }

    const registrarAluno = async (nome: string, matricula: string, anoLetivo: string, curso: string, turma: string, image: string) => {
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
            const file = new File([blob], 'aluno.jpeg', { type: mimeString });

            const formData = new FormData();
            formData.append('image', file);
            formData.append('nome', nome);
            formData.append('matricula', matricula);
            formData.append('ano_letivo', anoLetivo);
            formData.append('curso', curso);
            formData.append('id_turma', turma);
            formData.append('tipo', 'aluno');

            const res = await axios.post(`${API_URL}usuario/registrar`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Aluno registrado!', res.data);
            setShow(false);
        } catch (error: any) {
            console.log(`Erro ao registrar aluno: ${error}`)
            setResponseError(error.response.data.message)
        } finally {
            setIsLoading?.(false);
        }
    }

    const onRegister = () => {
        const nomeError = nome.value == '' ? '*Campo obrigatório' : '';
        const matriculaError = matricula.value == '' ? '*Campo obrigatório' : '';
        const anoLetivoError = anoLetivo.value == '' ? '*Campo obrigatório' : '';
        const cursoError = curso.value == '' ? '*Campo obrigatório' : '';
        const turmaError = turma.value == '' ? '*Campo obrigatório' : '';
        const imageError = image.value == '' ? '*Campo obrigatório' : '';

        if (imageError || nomeError || matriculaError || anoLetivoError || cursoError || turmaError) {
            setNome({ ...nome, error: nomeError });
            setMatricula({ ...matricula, error: matriculaError });
            setAnoLetivo({ ...anoLetivo, error: anoLetivoError });
            setCurso({ ...curso, error: cursoError });
            setTurma({ ...turma, error: turmaError });
            setImage({ ...image, error: imageError });

            return;
        }

        registrarAluno(
            nome.value,
            matricula.value,
            anoLetivo.value,
            curso.value,
            turma.value,
            image.value
        )
    }

    return (
        <>{
            show && <div className="modal-add-aluno" onClick={onClose}>
                <div className="container" onClick={stopPropagation}>
                    {responseError && <p className="response-error">Ocorreu uma falha: {responseError}</p>}

                    <div className="row">
                        <TextInput
                            label='Digite o nome do aluno:'
                            placeholder='Nome'
                            value={nome.value}
                            changeValue={(value) => { setNome({ value: value, error: '' }) }}
                            errorText={nome.error}
                        />

                        <TextInput
                            label='Digite o curso do aluno:'
                            placeholder='Curso'
                            value={curso.value}
                            changeValue={(value) => { setCurso({ value: value, error: '' }) }}
                            errorText={curso.error}
                        />
                    </div>

                    <div className="row">
                        <TextInput
                            label='Digite o número de matricula:'
                            placeholder='Matrícula'
                            value={matricula.value}
                            changeValue={(value) => { setMatricula({ value: value, error: '' }) }}
                            errorText={matricula.error}
                        />

                        <TextInput
                            label='Digite o ano letivo:'
                            placeholder='Ano Letivo'
                            value={anoLetivo.value}
                            changeValue={(value) => { setAnoLetivo({ value: value, error: '' }) }}
                            errorText={anoLetivo.error}
                        />
                    </div>

                    <div className="row">
                        <TextInput
                            label='Digite a turma do aluno:'
                            placeholder='Turma'
                            value={turma.value}
                            changeValue={(value) => { setTurma({ value: value, error: '' }) }}
                            errorText={turma.error}
                        />

                        <InputFile
                            placeholder='Selecionar imagem'
                            label='Imagem'
                            // file={image.value}
                            loadFile={loadFile}
                            errorText={image.error}
                        />
                    </div>

                    <div className="row">
                        <Button
                            text='Cancelar'
                            type='cancel'
                            onClick={onClose}
                        />

                        <Button
                            text='Registrar'
                            type='contained'
                            onClick={onRegister}
                        />
                    </div>
                </div>
            </div>
        }</>
    )
}