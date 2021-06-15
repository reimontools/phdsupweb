import { useState, useEffect} from "react";
import { Table, Loading, Container, Dialog, Title, Button, DropDown, Avatar, ButtonFloat, PersonCrud, ConcreCrud, Simbol, Text, PersonSupervisorUniversityList, PersonUniversityList } from "../../../component";
import { getList } from '../../../helpers/listHelper';
import useModal from "../../../hooks/useModal";
import axios from '../../../config/axios'
import useAppContext from '../../../hooks/useAppContext';

const ListPerson = () => {
    // CONTEXT ######################################################################################################################################
    const { user } = useAppContext();

    // CONST ########################################################################################################################################
    const defaultPerson = {person_id: 0, person_name: "", person_surname: "", person_nickname: "", person_email: "", person_mobile_number: "", country_id: ""};

    // STATE ########################################################################################################################################
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPerson, setcurrentPerson] = useState({});
    const [personUniversities, setPersonUniversities] = useState([]);
    const [personSupervisorUniversities, setPersonSupervisorUniversities] = useState([]);
    const [dialogOptions, setDialogOptions] = useState({});

    // MODAL ########################################################################################################################################
    const [isOpenModalCrudPerson, openModalCrudPerson, closeModalCrudPerson] = useModal();
    const [isOpenModalConcre, openModalConcre, closeModalConcre] = useModal();
    const [isOpenModalPersonSupervisor, openModalPersonSupervisor, closeModalPersonSupervisor] = useModal();
    const [isOpenModalPersonUniversity, openModalPersonUniversity, closeModalPersonUniversity] = useModal();

    // EFFECT #######################################################################################################################################
    useEffect(() => fetchPersons(), []);

    // FETCHS #######################################################################################################################################
    const fetchPersons = async () => {
        setLoading(true);
        let persons = await getList("person");
        setPersons(persons);
        setLoading(false);
    };

    const fetchPersonSupervisorUniversitiesByPersonId = async person_id => {
        const personSupervisorUniversities = await getList("person-supervisor-university/" + person_id);
        setPersonSupervisorUniversities(personSupervisorUniversities);
    };

    const fetchPersonUniversitiesByPersonId = async person_id => {
        const personUniversities = await getList("person-university/" + person_id);
        setPersonUniversities(personUniversities);
    };


    const fetchAll = async person_id => {
        fetchPersons()
        fetchPersonSupervisorUniversitiesByPersonId(person_id);
        fetchPersonUniversitiesByPersonId(person_id);
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

    const handleUserState = (e, state_id, person) => {
        e.stopPropagation();
        if (person.user_state_id !== state_id) updateUserState(person.user_id, state_id);
    };

    const handleButtonSupervisors = (e, person) => {
        e.stopPropagation();
        setcurrentPerson(person);
        fetchPersonSupervisorUniversitiesByPersonId(person.person_id);
        openModalPersonSupervisor();
    };

    const handleButtonUniversities = (e, person) => {
        e.stopPropagation();
        setcurrentPerson(person);
        fetchPersonUniversitiesByPersonId(person.person_id);
        openModalPersonUniversity();
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
                <th>Universities</th>
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
                <td className={classContent} data-label='Universities'>{renderButtonUniversities(person)}</td>
                <td className={classContent} data-label='Supervisors'>{renderButtonSupervisorUniversities(person)}</td>
                <td className={classContent} data-label='Rol'>{person.rol_name}</td>
                <td className={classContent} data-label='User state'>{renderButtonState(person)}</td>
                <td className={classActions}>{renderActions(person)}</td>
            </tr>
        );
    };

    const renderButtonState = person => {
        return (
            <DropDown.ButtonText family="more" text={person.state_name} >
                <div onClick={e => handleUserState(e, 1, person)}><Simbol.Point family="active"/>Active</div>
                <div onClick={e => handleUserState(e, 2, person)}><Simbol.Point family="pending"/>Pending</div>
                <div onClick={e => handleUserState(e, 3, person)}><Simbol.Point family="reject"/>Reject</div>
            </DropDown.ButtonText>
        );
    };

    const renderButtonSupervisorUniversities = person => {
        if (person.rol_id === 1) return "-";
        var text = "", family = "";
        if (person.person_count_supervisor_university > 0) {
            text = person.person_count_supervisor_university + " Supervisors";
            family = "remove";
        } else {
            text = "No Supervisors";
            family = "remove";
        };
        return <Button.Basic family={family} onClick={e => handleButtonSupervisors(e, person)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    const renderButtonUniversities = person => {
        if (person.rol_id === 1) return "-";
        var text = "", family = "";
        if (person.person_count_university > 0) {
            text = person.person_count_university + " Universities";
            family = "remove";
        } else {
            text = "No Universities";
            family = "remove";
        };
        return <Button.Basic family={family} onClick={e => handleButtonUniversities(e, person)} fit height="auto" size="12px" weight="400" hover>{text}</Button.Basic>;
    };

    const renderDropDown = person => {
        return (
            <DropDown.ButtonIcon family="more">
                <div onClick={e => handleUpdatePerson(e, person)}>Update</div>
                {person.rol_id !== 1 && <div onClick={e => handleDelete(e, person)}>Delete</div>}
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
                <Text.Basic>{person.person_fullname}</Text.Basic>
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
            <PersonCrud fetch={fetchPersons} person={currentPerson} isOpen={isOpenModalCrudPerson} close={closeModalCrudPerson} />

            {/* CRUD CONCRE ######################################################################################################################### */}
            <ConcreCrud.Basic person={currentPerson} isOpen={isOpenModalConcre} close={closeModalConcre} />

            {/* LIST SUPERVISOR UNIVERSITY ########################################################################################################## */}
            <PersonSupervisorUniversityList person_id={currentPerson.person_id} fetch={fetchAll} personSupervisorUniversities={personSupervisorUniversities} isOpen={isOpenModalPersonSupervisor} close={closeModalPersonSupervisor} />

            {/* LIST UNIVERSITIES ################################################################################################################### */}
            <PersonUniversityList user_id={user.user_id} person_id={currentPerson.person_id} fetch={fetchAll} personUniversities={personUniversities} isOpen={isOpenModalPersonUniversity} close={closeModalPersonUniversity} />

        </Container.Primary>
    );
};

export default ListPerson;