import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Check, Table, Loading, Container, Icon, Dialog, Modal, Title, Button, Select, Input } from "../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper';
import useModal from "../../hooks/useModal";
import { LOWERCASEREGEX, UPPERCASEREGEX, NUMERICREGEX } from "../../helpers/paramHelper";
import useList from '../../hooks/useList';
import axios from '../../config/axios'

const User = () => {
    
    // CONST ########################################################################################################################################
    const defaultPassword = {password: "", passwordConfirm: ""};

    // STATE ########################################################################################################################################
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(0);
    const [dialogOptions, setDialogOptions] = useState({});
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const [isOpenModalPassword, openModalPassword, closeModalPassword] = useModal();

    // LIST #########################################################################################################################################
    const phdCurrentYearList = useList("list/phd-current-year");
    const phdFinishYearList = useList("list/phd-finish-year");
    const countryList = useList("list/country");
    const universityList = useList("list/university");
    const researchAreaList = useList("list/research-area");

    // EFFECT #######################################################################################################################################
    useEffect(() => fetchUsers(), []);

    // CRUD VALIDATIONS #############################################################################################################################
    const schemaCrud = Yup.object().shape({
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
        phd_finish_year_id: Yup.string()
            .required('Required!'),
        phd_current_year_id: Yup.string()
            .required('Required!')
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud, reset: resetCrud } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // PASSWORD VALIDATIONS #########################################################################################################################
    const schemaPassword = Yup.object().shape({
        password: Yup.string()
            .required('Required!')
            .min(8, "Minimun 8 characters required!")
            .matches(NUMERICREGEX, 'One number required!')
            .matches(LOWERCASEREGEX, 'One lowercase required!')
            .matches(UPPERCASEREGEX, 'One uppercase required!'),
        passwordConfirm: Yup.string()
            .required('Required!')
            .oneOf([Yup.ref('password')], 'Password must be the same!')
    });

    const { register: registerPassword, handleSubmit: handleSubmitPassword, errors: errorsPassword, reset: resetPassword } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaPassword)
    });

    // FETCHS #######################################################################################################################################
    const fetchUsers = async () => {
        setLoading(true);
        let users = await getList("user");
        setUsers(users);
        setLoading(false);
    };

    // CRUD #########################################################################################################################################
    const updateUser = async data => {
        const phd_year_id = data.is_phd_finish ? data.phd_finish_year_id : data.phd_current_year_id;
        try {
            const res = await axios.post("user", {user_id: currentUserId, phd_year_id, ...data});
            switch(res.data.result.cod) {
                case 0:
                    // setDialogOptions({family: "info", title: 'Success', text : 'User was updated!'});
                    fetchUsers();
                    closeModalCrud();
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'User already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'User already exists! (nonActive)'})
                    break;
                default:
                    setDialogOptions({family: "info", title: 'Error', text : 'Error: ' + res.data.result.msg})
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateUserState = async (id, state_id) => {
        try {
            const res = await axios.post("state/", {state_id, name: "user", id});
            if (res.data.result.cod === 0) return fetchUsers();
            setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateUserPassword = async data => {
        try {
            const res = await axios.post("user/concre", {user_id: currentUserId, ...data});
            if (res.data.result.cod === 0) {
                fetchUsers();
                closeModalPassword();
            } else {
                setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateUserActive = async id => {
        try {
            const res = await axios.put("user/" + id);
            if (!res.data.error) {
                fetchUsers();
            };
        } catch (err) {
            console.log(err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = id => {
        if (id === currentUserId) {
            setCurrentUserId(0);
        } else {
            setCurrentUserId(id);
        };
    };

    const handleClickOptions = (e, user) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this user?', text: 'Are you sure you want to delete this user?', action: () => updateUserActive(user.user_id) });
    };

    const handleModalCrud = (e, user) => {
        e.stopPropagation();
        setCurrentUserId(user.user_id);
        resetCrud(user);
        openModalCrud();
    };

    const handleModalPassword = (e, user) => {
        e.stopPropagation();
        setCurrentUserId(user.user_id);
        resetPassword(defaultPassword);
        openModalPassword();
    };

    const handleUserState = (e, user) => {
        e.stopPropagation();
        if (user.state_id === 1) updateUserState(user.user_id, 2);
        if (user.state_id === 2) updateUserState(user.user_id, 1);
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Fullname</th>
                <th>Nickname</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>University</th>
                <th>Rol</th>
                <th>State</th>
                <th>Actions</th>
            </tr>
        );
    };

    const renderTableRows = user => {
        var classContent = "";
        var classActions = "";

        if (user.user_id === currentUserId) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={user.user_id} onClick={() => handleExpandir(user.user_id)}>
                <td className="head">{user.fullname}</td>
                <td className={classContent} data-label='Nickname'>{user.nickname}</td>
                <td className={classContent} data-label='Email'>{user.email}</td>
                <td className={classContent} data-label='Mobile'>{user.mobile_number}</td>
                <td className={classContent} data-label='University'>{user.university_name}</td>
                <td className={classContent} data-label='Rol'>{user.rol_name}</td>
                {/* <td className={classContent} data-label='State'>{user.state_name}</td> */}
                <td className={classContent} data-label='State'>{renderButtonState(user)}</td>
                <td className={classActions}>{renderActions(user)}</td>
            </tr>  
        );
    };

    const renderActions = user => {
        return (
            <div className="td-container">
                <Icon.Basic 
                    onClick={e => handleModalCrud(e, user)}
                    family="edit"
                    hover
                />
                <Icon.Basic 
                    onClick={e => handleModalPassword(e, user)}
                    family="password" 
                    hover
                />
                <Icon.Basic 
                    onClick={e => handleClickOptions(e, user)}
                    family="delete" 
                    hover
                />
            </div>
        );
    };

    const renderButtonState = user => {
        var text = user.state_name, family = "";
        user.state_id === 1 ? family = "check" : family = "edit";
        return <Button.Basic family={family} onClick={e => handleUserState(e, user)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };
    
    // JSX ##########################################################################################################################################
    return (
        <Container.Primary>
            <Title.Primary>Users</Title.Primary>
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <Table.Basic>
                        <thead>{ renderTableHead() }</thead>
                        <tbody>{ users.map(user => renderTableRows(user)) }</tbody>
                    </Table.Basic>
                </Container.Table>
            }

            {/* MODAL CRUD ########################################################################################################################## */}
            <Modal.Form isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>{currentUserId === 0 ? 'New User' : 'Update User'}</Title.Basic>
                    <Input.Validation name="name" label="Name *" placeholder="Set your name" register={registerCrud} error={errorsCrud.name} />
                    <Input.Validation name="surname" label="Surname *" placeholder="Set your surname" register={registerCrud} error={errorsCrud.surname} />
                    <Input.Validation name="nickname" label="Nickname *" placeholder="Set your nickname" register={registerCrud} error={errorsCrud.nickname} />
                    <Input.Validation name="email" label="Email *" placeholder="example@gmail.com" register={registerCrud} error={errorsCrud.email} />
                    <Input.Validation name="mobile_number" label="Mobile number" placeholder="+569 98416398" register={registerCrud} error={errorsCrud.mobile} />
                    <Select.Validation name="country_id" label="Country *" placeholder="Select a country" register={registerCrud} content={countryList} error={errorsCrud.country_id}/>
                    <Select.Validation name="university_id" label="University *" placeholder="Select a university" register={registerCrud} content={universityList} error={errorsCrud.university_id}/>
                    <Select.Validation name="research_area_id" label="Research area *" placeholder="Select a research area" register={registerCrud} content={researchAreaList} error={errorsCrud.research_area_id}/>
                    <Check.Basic name="is_phd_finish" label="Did you finish your PhD?" register={registerCrud} />
                    <Select.Validation name="phd_finish_year_id" label="In which year did you finish?" placeholder="Select a year" register={registerCrud} content={phdFinishYearList} error={errorsCrud.phd_finish_year_id}/>
                    <Select.Validation name="phd_current_year_id" label=" In which year are you?" placeholder="Select a year" register={registerCrud} content={phdCurrentYearList} error={errorsCrud.phd_current_year_id}/>
                    <Input.Validation name="keywords" label="Keywords" placeholder="Mention at least 3" register={registerCrud} error={errorsCrud.keywords} />
                    <Button.Basic onClick={handleSubmitCrud(updateUser)}>Save</Button.Basic>
                </Container.Basic>
            </Modal.Form>
            
            {/* MODAL PASSWORD ###################################################################################################################### */}
            <Modal.Form isOpen={isOpenModalPassword} closeModal={closeModalPassword}>
                <Container.Basic>
                    <Title.Basic>Update password</Title.Basic>
                    <Input.Validation name="password" label="Password *" type="password" register={registerPassword} error={errorsPassword.password} />
                    <Input.Validation name="passwordConfirm" label="Confirm password *" type="password" register={registerPassword} error={errorsPassword.passwordConfirm} />
                    <Button.Basic onClick={handleSubmitPassword(updateUserPassword)}>Save</Button.Basic>
                </Container.Basic>
            </Modal.Form>
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
        </Container.Primary>
    );  
};

export default User;