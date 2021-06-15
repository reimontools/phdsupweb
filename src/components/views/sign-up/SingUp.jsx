import { useForm } from "react-hook-form";
import { Input, Container, Button, Select, Dialog, Title } from "../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import axios from '../../../config/axios';
import useList from '../../../hooks/useList';
import { getCapitalInSentence, LOWERCASEREGEX, UPPERCASEREGEX, NUMERICREGEX } from "../../../helpers/paramHelper";

const SignUp = () => {
    // CONST ########################################################################################################################################
    const defaultPerson = {person_name: "", person_surname: "", person_nickname: "", person_email: "", person_mobile_number: "", country_id: "", concre: "", concreConfirm: ""};

    // STATE #######################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

    // LIST ######################################################################################################################################## 
    const countryList = useList("list/country");
    
    // VALIDATIONS #################################################################################################################################
    const schemaCrud = Yup.object().shape({
        person_name: Yup
            .string()
            .required('Required!')
            .trim()
            .min(2, "Too short!")
            .max(50, "Too long!")
            .transform(value => getCapitalInSentence(value)),
        person_surname: Yup
            .string()
            .required('Required!')
            .trim()
            .min(2, "Too short!")
            .max(50, "Too long!")
            .transform(value => getCapitalInSentence(value)),
        person_nickname: Yup
            .string()
            .required('Required!')
            .trim()
            .min(3, "Too short!"),
        person_email: Yup
            .string()
            .required('Required!')
            .lowercase()
            .trim()
            .email("Must be a valid email !"),
        person_mobile_number: Yup
            .string()
            .required('Required!')
            .trim(),
        country_id: Yup
            .string()
            .required('Required!'),
        concre: Yup
            .string()
            .required('Required!')
            .min(8, "Minimun 8 characters required!")
            .matches(NUMERICREGEX, 'One number required!')
            .matches(LOWERCASEREGEX, 'One lowercase required!')
            .matches(UPPERCASEREGEX, 'One uppercase required!'),
        concreConfirm: Yup
            .string()
            .required('Required!')
            .oneOf([Yup.ref('concre')], 'Password must be the same!')
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // CRUD #########################################################################################################################################
    const SignUp = async data => {
        try {
            const res = await axios.post("signup", data);
            switch(res.data.result.cod) {
                case 0:
                    resetCrud(defaultPerson);
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
    
    // JSX ##########################################################################################################################################
    return (
        <Container.Basic width="400px">
            <Title.Primary>Sign Up</Title.Primary>
            <Input.Validation name="person_name" label="Name *" placeholder="Set your name" register={registerCrud} error={errorsCrud.person_name} />
            <Input.Validation name="person_surname" label="Surname *" placeholder="Set your surname" register={registerCrud} error={errorsCrud.person_surname} />
            <Input.Validation name="person_nickname" label="Nickname *" placeholder="Set your nickname" register={registerCrud} error={errorsCrud.person_nickname} />
            <Input.Validation name="person_email" label="Email *" placeholder="example@gmail.com" register={registerCrud} error={errorsCrud.person_email} />
            <Input.Validation name="person_mobile_number" label="Mobile number" placeholder="+569 98416398" register={registerCrud} error={errorsCrud.person_mobile_number} />
            <Select.Validation name="country_id" label="Country *" placeholder="Select a country" register={registerCrud} content={countryList} error={errorsCrud.country_id}/>
            <Input.Validation name="concre" label="Password *" type="password" placeholder="Set a password" register={registerCrud} error={errorsCrud.concre} />
            <Input.Validation name="concreConfirm" label="Confirm password *" type="password" placeholder="Confirm it" register={registerCrud} error={errorsCrud.concreConfirm} />
            <Button.Basic onClick={handleSubmitCrud(SignUp)}>Sign Up</Button.Basic>

            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />
        </Container.Basic>
    );
};

export default SignUp;