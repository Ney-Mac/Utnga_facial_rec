import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Logo from '../../assets/images/logo/logo_utanga.png'
import { TextInput, Button } from '../../components';
import './loginProfAdm.scss';

export default function LoginProfAdm() {
    const { loginAdmProf, responseError } = useContext(AuthContext)!;
    const [numFunc, setNumFunc] = useState({ value: '0001', error: '' });
    const [pass, setPass] = useState({ value: '12345', error: '' });

    const onLogin = () => {
        const numFuncError = numFunc.value === '' ? '*Campo obrigatorio.' : '';
        const passError = pass.value === '' ? '*Campo obrigatorio.' : '';

        if (numFuncError || passError) {
            setNumFunc({ ...numFunc, error: numFuncError });
            setPass({ ...pass, error: passError });
            return
        }

        loginAdmProf(numFunc.value, pass.value);
    }

    return (
        <main className='login-prof-adm'>
            <div className="container">
                <img src={Logo} alt="UTANGA" className="logo" />
                <h2 className="title">UNIVERSIDADE TÉCNICA DE ANGOLA</h2>
                {responseError && <p className="response-error">Ocorreu uma falha: {responseError}</p>}

                <form className="campos-container" onSubmit={(event) => { event.preventDefault() }}>
                    <TextInput
                        placeholder='Nº de funcionário'
                        value={numFunc.value}
                        errorText={numFunc.error}
                        changeValue={(value) => { setNumFunc({ value: value, error: '' }) }}
                    />

                    <TextInput
                        placeholder='Palavra-passe'
                        value={pass.value}
                        errorText={pass.error}
                        changeValue={(value) => { setPass({ value: value, error: '' }) }}
                        password
                    />

                    <Button
                        text='Validar dadis de Acesso'
                        type='contained'
                        onClick={onLogin}
                    />
                </form>
            </div>
        </main>
    )
}