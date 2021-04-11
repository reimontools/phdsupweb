import { useForm } from "react-hook-form";
import { Input, Title, Container, Button, Check, Select } from "../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
// import axios from '../../config/axios';
// import useAppContext from "../../hooks/useAppContext";

const SignUp = () => {
    // const defaultData = {email: '', password: ''};
    // const { signIn } = useAppContext();
    const [isCurrentPhd, setIsCurrentPhd] = useState(false);
    const [isFinishPhd, setIsFinishPhd] = useState(false);
    
    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        name: Yup.string().required('Required'),
        surname: Yup.string().required('Required'),
        nickname: Yup.string().required('Required'),
        email: Yup.string().email("Invalid format").required('Required'),
        // mobile: Yup.string().required('Required'),
        yearCurrentPhd: Yup.string().required('Required'),
        password: Yup.string().required('Required')
    });

    const { register, handleSubmit, errors } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const logIn = async data => {
        alert("en desarrollo!!!", data)
    };

    const yearCurrentPhdList = [{id: 1, name: 1}, {id: 2, name: 2}, {id: 3, name: 3}, {id: 4, name: 4}, {id: 5, name: 5}, {id: 6, name: 6}];
    const yearFinishPhdList = [{id: 1, name: "1-3 years ago"}, {id: 2, name: "4-6 years ago"}, {id: 3, name: "7-9 years ago"}, {id: 4, name: "More than 10 years ago"}];
    
    /*JSX ############################################################################################*/ 
    return (
        <Container.Basic width="400px">
            <Title.Basic>Sign Up</Title.Basic>
            <Input.TextValidation name="name" placeholder="Name" register={register} error={errors.name} />
            <Input.TextValidation name="surname" placeholder="Surname" register={register} error={errors.surname} />
            <Input.TextValidation name="nickname" placeholder="Nickname" register={register} error={errors.nickname} />
            <Input.TextValidation name="email" type="email" placeholder="email@email.com" register={register} error={errors.email} />
            <Input.TextValidation name="mobile" placeholder="Mobile number" register={register} error={errors.mobile} />

            <Check.Basic id="currentPhd" value={isCurrentPhd} action={setIsCurrentPhd} text="Are you currently PhD student?" flexJustifyContent="space-between"/>
            {isCurrentPhd && <Select.Validation name="yearCurrentPhd" type="select" text="In which year are you?" register={register} content={yearCurrentPhdList} />}

            <Check.Basic id="finishPhd" value={isFinishPhd} action={setIsFinishPhd} text="Did you finished your PhD?" flexJustifyContent="space-between"/>
            {isFinishPhd && <Select.Validation name="yearFinishPhd" type="select" text="In which Year?" register={register} content={yearFinishPhdList} />}

            <Input.TextValidation placeholder="Password" name="password" type="password" register={register} error={errors.password} />
            <Input.TextValidation placeholder="Confirm password" name="passwordToValid" type="password" register={register} error={errors.password} />
            <Button.Basic action={handleSubmit(logIn)}>Sign In</Button.Basic>
        </Container.Basic>
    );
};

export default SignUp;