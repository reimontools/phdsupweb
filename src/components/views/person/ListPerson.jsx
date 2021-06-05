import { useState, useEffect} from "react";
import { Table, Loading, Container, Dialog, Title, Button, DropDown, Avatar, ListPersonSupervisor, ButtonFloat, CrudPerson, CrudConcre, Simbol } from "../../../component";
import { getList } from '../../../helpers/listHelper';
import useModal from "../../../hooks/useModal";
import axios from '../../../config/axios'

const ListPerson = () => {
    // CONST ########################################################################################################################################
    const defaultPerson = {person_id: 0, person_name: "", person_surname: "", person_nickname: "", person_email: "", person_mobile_number: "", country_id: "", person_is_phd_finish: false, phd_finish_year_id: "", phd_current_year_id: ""};

    // STATE ########################################################################################################################################
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPerson, setcurrentPerson] = useState({});
    const [personSupervisors, setPersonSupervisors] = useState([]);
    const [dialogOptions, setDialogOptions] = useState({});

    // MODAL ########################################################################################################################################
    const [isOpenModalCrudPerson, openModalCrudPerson, closeModalCrudPerson] = useModal();
    const [isOpenModalConcre, openModalConcre, closeModalConcre] = useModal();
    const [isOpenModalPersonSupervisor, openModalPersonSupervisor, closeModalPersonSupervisor] = useModal();

    // EFFECT #######################################################################################################################################
    useEffect(() => fetchPersons(), []);

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
    const updateUserState = async (id, state_id) => {
        try {
            const res = await axios.post("state/", {state_id, name: "user", id});
            if (res.data.result.cod === 0) return fetchPersons();
            setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
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

    const handleUpdatePerson = (e, person) => {
        e.stopPropagation();
        setcurrentPerson(person);
        openModalCrudPerson();
    };

    const handleUpdateConcre = (e, person) => {
        e.stopPropagation();
        setcurrentPerson(person);
        openModalConcre();
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
                <td className={classContent} data-label='Nickname'>{person.person_nickname}</td>
                <td className={classContent} data-label='Email'>{person.person_email}</td>
                <td className={classContent} data-label='Mobile'>{person.person_mobile_number}</td>
                <td className={classContent} data-label='Country'>{person.country_name}</td>
                <td className={classContent} data-label='Supervisors'>{renderButtonSupervisors(person)}</td>
                <td className={classContent} data-label='Rol'>{person.rol_name}</td>
                <td className={classContent} data-label='User status'>{renderButtonState(person)}</td>
                <td className={classActions}>{renderActions(person)}</td>
            </tr>
        );
    };

    const renderButtonState = person => {
        var text = person.state_name;
        // person.user_state_id === 1 ? family = "check" : family = "edit";
        // return <Button.Basic family={family} onClick={e => handleUserState(e, person)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
        return (
            <DropDown.ButtonText family="more" text={text} >
                <div onClick={e => handleUserState(e, person)}><Simbol.Point family="add"/>Active</div>
                <div><Simbol.Point family="alert" />Pending</div>
            </DropDown.ButtonText>
        );
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
            <DropDown.ButtonIcon family="more">
                <div onClick={e => handleUpdatePerson(e, person)}>Update</div>
                <div onClick={e => handleDelete(e, person)}>Delete</div>
                <div onClick={e => handleUpdateConcre(e, person)}>Password</div>
            </DropDown.ButtonIcon>
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
                <Avatar.Letter>{person.person_name[0]}</Avatar.Letter>
                {person.person_fullname}
            </div>
        );
    };

    // JSX ##########################################################################################################################################
    return (
        <Container.Primary>
            <Title.Primary>Persons</Title.Primary>
            {loading
               ?<Loading/>
               :<Container.Table>
                    {persons.length === 0
                       ?<Container.NoRows>There is not persons.</Container.NoRows>
                       :<Table.Basic>
                            <thead>{renderTableHead()}</thead>
                            <tbody>{persons.map(person => renderTableRows(person))}</tbody>
                        </Table.Basic>
                    }
                </Container.Table>
            }

            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon onClick={e => handleUpdatePerson(e, defaultPerson)} hover family="newFloat"/>

            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />

            {/* CRUD PERSON ######################################################################################################################### */}
            <CrudPerson.Basic fetch={fetchPersons} person={currentPerson} isOpen={isOpenModalCrudPerson} close={closeModalCrudPerson} />

            {/* CRUD CONCRE ######################################################################################################################### */}
            <CrudConcre.Basic person={currentPerson} isOpen={isOpenModalConcre} close={closeModalConcre} />

            {/* LIST SUPERVISOR UNIVERSITY ########################################################################################################## */}
            <ListPersonSupervisor.Basic person_id={currentPerson.person_id} fetch={fetchAll} personSupervisors={personSupervisors} isOpen={isOpenModalPersonSupervisor} close={closeModalPersonSupervisor} />

        </Container.Primary>
    );
};

export default ListPerson;