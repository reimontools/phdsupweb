import { useForm } from "react-hook-form";
import { Input, Container, Button, Check, Select, Dialog, Title } from "../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import axios from '../../config/axios';
import useList from '../../hooks/useList';

const SignUp = () => {

    /*STATES #########################################################################################*/ 
    const [dialogOptions, setDialogOptions] = useState({});

    /*LIST ###########################################################################################*/ 
    const phdCurrentYearList = useList("list/phd-current-year");
    const phdFinishYearList = useList("list/phd-finish-year");
    const countryList = useList("list/country");
    const universityList = useList("list/university");
    const researchAreaList = useList("list/research-area");
    
    /*VALIDATIONS ####################################################################################*/ 
    const lowercaseRegex = /(?=.*[a-z])/;
    const uppercaseRegex = /(?=.*[A-Z])/;
    const numericRegex = /(?=.*[0-9])/;

    const schema = Yup.object().shape({
        name: Yup.string()
            .required('Required !')
            .min(2, "Too short!"),
        surname: Yup.string()
            .required('Required!')
            .min(2, "Too short!"),
        nickname: Yup.string()
            .required('Required!')
            .min(4, "Too short!"),
        email: Yup.string()
            .required('Required!')
            .lowercase()
            .email("Must be a valid email !"),
        country_id: Yup.string()
            .required('Required!'),
        university_id: Yup.string()
            .required('Required!'),
        research_area_id: Yup.string()
            .required('Required!'),
        phd_year_id: Yup.string()
            .required('Required!'),
        password: Yup.string()
            .required('Required!')
            .min(8, "Minimun 8 characters required!")
            .matches(numericRegex, 'One number required!')
            .matches(lowercaseRegex, 'One lowercase required!')
            .matches(uppercaseRegex, 'One uppercase required!'),
        passwordConfirm: Yup.string()
            .required('Required!')
            .oneOf([Yup.ref('password')], 'Password must be the same!')
    });

    const { register, handleSubmit, errors, watch } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

    const isFinishPhd = watch("is_phd_finish");

    /*CRUD ###########################################################################################*/ 
    const SignUp = async data => {
        try {
            const res = await axios.post("user", {user_id: 0, ...data});
            switch(res.data.result.cod) {
                case 0:
                    setDialogOptions({family: "info", title: 'Success', text : 'User was submited!'})
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'User already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'User already exists (nonActive)!'})
                    break;
                default:
                    setDialogOptions({family: "info", title: 'Error', text : 'Error: ' + res.data.result.msg})
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    /*JSX ############################################################################################*/ 
    return (
        <Container.Basic width="400px">
            <Title.Primary>Sign Up</Title.Primary>
            <Input.Validation name="name" label="Name *" placeholder="Set your name" register={register} error={errors.name} />
            <Input.Validation name="surname" label="Surname *" placeholder="Set your surname" register={register} error={errors.surname} />
            <Input.Validation name="nickname" label="Nickname *" placeholder="Set your nickname" register={register} error={errors.nickname} />
            <Input.Validation name="email" label="Email *" placeholder="example@gmail.com" register={register} error={errors.email} />
            <Input.Validation name="mobile_number" label="Mobile number" placeholder="+569 98416398" register={register} error={errors.mobile} />
            <Select.Validation name="country_id" label="Country *" placeholder="Select a country" register={register} content={countryList} error={errors.country_id}/>
            <Select.Validation name="university_id" label="University *" placeholder="Select a university" register={register} content={universityList} error={errors.university_id}/>
            <Select.Validation name="research_area_id" label="Research area *" placeholder="Select a research area" register={register} content={researchAreaList} error={errors.research_area_id}/>
            <Check.Basic name="is_phd_finish" label="Did you finish your PhD?" register={register} />
            {isFinishPhd 
                ? <Select.Validation name="phd_year_id" label="In which year did you finish?" placeholder="Select a year" register={register} content={phdFinishYearList} error={errors.phd_year_id}/>
                : <Select.Validation name="phd_year_id" label=" In which year are you?" placeholder="Select a year" register={register} content={phdCurrentYearList} error={errors.phd_year_id}/>
            }
            <Input.Validation name="keywords" label="Keywords" placeholder="Mention at least 3" register={register} error={errors.keywords} />
            <Input.Validation name="password" label="Password *" type="password" register={register} error={errors.password} />
            <Input.Validation name="passwordConfirm" label="Confirm password *" type="password" register={register} error={errors.passwordConfirm} />
            <Button.Basic onClick={handleSubmit(SignUp)}>Sign Up</Button.Basic>
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />
        </Container.Basic>
    );
};

export default SignUp;