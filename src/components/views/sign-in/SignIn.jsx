
import { useForm } from "react-hook-form";
import { Input, Title, Container, Button } from "../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../config/axios';
import useAppContext from "../../../hooks/useAppContext";

const SignIn = () => {
    // const defaultData = {email: '', password: ''};
    const { signIn } = useAppContext();
    
    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        email: Yup.string()
            .required('Required!')
            .email("Must be a valid email !"),
        password: Yup.string()
            .required('Required!')
    });

    const { register, handleSubmit, errors } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const logIn = async data => {
        try {
            const res = await axios.post("auth/login", data);
            if (res.data.error) {
                return console.log(res.data.resultMessage);
            };
            if(res.data.resultCode === 0) {
                return console.log(res.data.resultMessage);
            };
            signIn(res.data.result);
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    /*JSX ############################################################################################*/ 
    return (
        <Container.Basic width="400px">
            <Title.Primary>Sign In</Title.Primary>
            <Input.Validation name="email" type="email" label="Email *" placeholder="email@email.com" register={register} error={errors.email}/>
            <Input.Validation name="password" type="password" label="Password *" placeholder="" register={register} error={errors.password} />
            <Button.Basic onClick={handleSubmit(logIn)}>Sign In</Button.Basic>
        </Container.Basic>
    );
};

export default SignIn;