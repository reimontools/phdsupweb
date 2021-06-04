import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Check, Table, Loading, Container, Dialog, Modal, Title, Button, Select, Input, DropDown, Avatar, PersonSupervisor } from "../../../component";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../../helpers/listHelper';
import useModal from "../../../hooks/useModal";
import { LOWERCASEREGEX, UPPERCASEREGEX, NUMERICREGEX } from "../../../helpers/paramHelper";
import useList from '../../../hooks/useList';
import axios from '../../../config/axios'

const Person = () => {
    
    // CONST ########################################################################################################################################
    const defaultPassword = {password: "", passwordConfirm: ""};

    // STATE ########################################################################################################################################
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPerson, setcurrentPerson] = useState({});
    const [personSupervisors, setPersonSupervisors] = useState([]);

    const [currentUserId, setcurrentUserId] = useState(0);
    const [dialogOptions, setDialogOptions] = useState({});

    // MODAL ########################################################################################################################################
    const [isOpenModalCrud, openModalCrud, closeModalCrud] = useModal();
    const [isOpenModalPassword, openModalPassword, closeModalPassword] = useModal();
    const [isOpenModalPersonSupervisor, openModalPersonSupervisor, closeModalPersonSupervisor] = useModal();  

    // LIST #########################################################################################################################################
    const phdCurrentYearList = useList("list/phd-current-year");
    const phdFinishYearList = useList("list/phd-finish-year");
    const countryList = useList("list/country");

    // EFFECT #######################################################################################################################################
    useEffect(() => fetchPersons(), []);

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
    const fetchPersons = async () => {
        setLoading(true);
        let persons = await getList("person");
        setPersons(persons);
        setLoading(false);
    };

    const fetchPersonSupervisors = async person_id => {
        const personSupervisors = await getList("person-supervisor/" + person_id);
        setPersonSupervisors(personSupervisors);
    };

    const fetchAll = async person_id => {
        fetchPersons()
        fetchPersonSupervisors(person_id);
    };

    // CRUD #########################################################################################################################################
    const updatePerson = async data => {
        const phd_year_id = data.is_phd_finish ? data.phd_finish_year_id : data.phd_current_year_id;
        try {
            const res = await axios.post("person", {person_id: currentPerson.person_id, phd_year_id, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchPersons();
                    closeModalCrud();
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Person already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'Person already exists! (nonActive)'})
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
            if (res.data.result.cod === 0) return fetchPersons();
            setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updateUserPassword = async data => {
        try {
            const res = await axios.post("user/concre", {user_id: currentUserId, ...data});
            if (res.data.result.cod === 0) {
                fetchPersons();
                closeModalPassword();
            } else {
                setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    const updatePersonIsActive = async id => {
        try {
            const res = await axios.put("person/" + id);
            if (!res.data.error) {
                fetchPersons();
            };
        } catch (err) {
            console.log(err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = person => {
        if (person.person_id === currentPerson.person_id) {
            setcurrentPerson(0);
        } else {
            setcurrentPerson(person);
        };
    };

    const handleDelete = (e, person) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this person?', text: 'Are you sure you want to delete this person?', action: () => updatePersonIsActive(person.person_id) });
    };

    const handleModalCrud = (e, person) => {
        e.stopPropagation();
        setcurrentPerson(person);
        resetCrud(person);
        openModalCrud();
    };

    const handleModalPassword = (e, person) => {
        e.stopPropagation();
        setcurrentUserId(person.user_id);
        resetPassword(defaultPassword);
        openModalPassword();
    };

    const handleUserState = (e, person) => {
        e.stopPropagation();
        if (person.user_state_id === 1) updateUserState(person.user_id, 2);
        if (person.user_state_id === 2) updateUserState(person.user_id, 1);
    };

    const handleButtonSupervisors = (e, person) => {
        e.stopPropagation();
        setcurrentPerson(person);
        fetchPersonSupervisors(person.person_id);
        openModalPersonSupervisor();
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Full Name</th>
                <th>Nickname</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Country</th>
                <th>Supervisors</th>
                <th>Rol</th>
                <th>User Status</th>
                <th></th>
            </tr>
        );
    };

    const renderTableRows = person => {
        var classContent = "";
        var classActions = "";

        if (person.person_id === currentPerson.person_id) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={person.person_id} onClick={() => handleExpandir(person)}>
                <td className="head">
                    {renderAvatar(person)}
                    <div className="dropdown">
                        {renderDropDown(person)}
                    </div>
                </td>
                <td className={classContent} data-label='Nickname'>{person.nickname}</td>
                <td className={classContent} data-label='Email'>{person.email}</td>
                <td className={classContent} data-label='Mobile'>{person.mobile_number}</td>
                <td className={classContent} data-label='Country'>{person.country_name}</td>
                <td className={classContent} data-label='Supervisors'>{renderButtonSupervisors(person)}</td>
                <td className={classContent} data-label='Rol'>{person.rol_name}</td>
                <td className={classContent} data-label='User status'>{renderButtonState(person)}</td>
                <td className={classActions}>{renderActions(person)}</td>
            </tr>  
        );
    };

    const renderButtonState = person => {
        var text = person.state_name, family = "";
        person.user_state_id === 1 ? family = "check" : family = "edit";
        return <Button.Basic family={family} onClick={e => handleUserState(e, person)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    const renderButtonSupervisors = person => {
        var text = "", family = "";
        if (person.person_count_supervisor > 0) {
            text = person.person_count_supervisor + " supervisors";
            family = "remove";
        } else {
            text = "No supervisors";
            family = "remove";
        };
        return <Button.Basic family={family} onClick={e => handleButtonSupervisors(e, person)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    const renderDropDown = person => {
        return (
            <DropDown.Basic family="more">
                <div className="menu-content" onClick={e => handleModalCrud(e, person)}>Update</div>
                <div className="menu-content" onClick={e => handleDelete(e, person)}>Delete</div>
                <div className="menu-content" onClick={e => handleModalPassword(e, person)}>Password</div>
            </DropDown.Basic>
        );
    };

    const renderActions = person => {
        return (
            <div className="td-container">
               {renderDropDown(person)}
            </div>
        );
    };

    const renderAvatar = person => {
        return (
            <div className="avatar-container">
                <Avatar.Letter>{person.name[0]}</Avatar.Letter>
                {person.fullname}
            </div>
        );
    };
    
    // JSX ##########################################################################################################################################
    return (
        <Container.Primary>
            <Title.Primary>Persons</Title.Primary>
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <Table.Basic>
                        <thead>{renderTableHead()}</thead>
                        <tbody>{persons.map(person => renderTableRows(person))}</tbody>
                    </Table.Basic>
                </Container.Table>
            }

            {/* MODAL CRUD ########################################################################################################################## */}
            <Modal.Form isOpen={isOpenModalCrud} closeModal={closeModalCrud}>
                <Container.Basic>
                    <Title.Basic>{currentPerson.person_id === 0 ? 'New Person' : 'Update Person'}</Title.Basic>
                    <Input.Validation name="name" label="Name *" placeholder="Set your name" register={registerCrud} error={errorsCrud.name} />
                    <Input.Validation name="surname" label="Surname *" placeholder="Set your surname" register={registerCrud} error={errorsCrud.surname} />
                    <Input.Validation name="nickname" label="Nickname *" placeholder="Set your nickname" register={registerCrud} error={errorsCrud.nickname} />
                    <Input.Validation name="email" label="Email *" placeholder="example@gmail.com" register={registerCrud} error={errorsCrud.email} />
                    <Input.Validation name="mobile_number" label="Mobile number" placeholder="+569 98416398" register={registerCrud} error={errorsCrud.mobile} />
                    <Select.Validation name="country_id" label="Country *" placeholder="Select a country" register={registerCrud} content={countryList} error={errorsCrud.country_id}/>
                    <Check.Basic name="is_phd_finish" label="Did you finish your PhD?" register={registerCrud} />
                    <Select.Validation name="phd_finish_year_id" label="In which year did you finish?" placeholder="Select a year" register={registerCrud} content={phdFinishYearList} error={errorsCrud.phd_finish_year_id}/>
                    <Select.Validation name="phd_current_year_id" label=" In which year are you?" placeholder="Select a year" register={registerCrud} content={phdCurrentYearList} error={errorsCrud.phd_current_year_id}/>
                    <Button.Basic onClick={handleSubmitCrud(updatePerson)}>Save</Button.Basic>
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

            {/* SUPERVISOR UNIVERSITY MODAL ######################################################################################################### */}
            <PersonSupervisor.Basic person_id={currentPerson.person_id} fetch={fetchAll} personSupervisors={personSupervisors} isOpen={isOpenModalPersonSupervisor} close={closeModalPersonSupervisor} /> 

        </Container.Primary>
    );  
};

export default Person;