import { Title, Container, ButtonFloat, Loading, Table, DropDown, Avatar, Dialog, Link, Text, PersonSupervisorUniversityCrudNa } from "../../../component";
import { useState, useEffect} from "react";
import { getList } from '../../../helpers/listHelper';
import useModal from "../../../hooks/useModal";
import axios from '../../../config/axios'
import useAppContext from '../../../hooks/useAppContext';

export default function PersonSupervisorUniversityListU() {
    // CONTEXT ######################################################################################################################################
    const { user } = useAppContext();

    // EFFECT #######################################################################################################################################
    useEffect(() => {
        fetchPersonSupervisorUniversitiesByPersonId(user.person_id);
    }, [user]);

    // CONST ########################################################################################################################################
    const defaultPersonSupervisor = {
        person_supervisor_university_id: 0, 
        supervisor_university_id: ""
    };

    // MODAL ########################################################################################################################################
    const [isOpenModalCrudPersonSupervisor, openModalCrudPersonSupervisor, closeModalCrudPersonSupervisor] = useModal();  

    // STATE ########################################################################################################################################
    const [personSupervisorUniversities, setPersonSupervisorUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPersonSupervisorUniversity, setCurrentPersonSupervisorUniversity] = useState({});
    const [dialogOptions, setDialogOptions] = useState({});

    // FETCHS #######################################################################################################################################
    const fetchPersonSupervisorUniversitiesByPersonId = async person_id => {
        setLoading(true);
        const personSupervisorUniversities = await getList("person-supervisor-university/" + person_id);
        setPersonSupervisorUniversities(personSupervisorUniversities);
        setLoading(false);
    };

    // CRUD #########################################################################################################################################
    const updatePersonSupervisorUniversityIsActive = async person_supervisor_university_id => {
        try {
            const res = await axios.put("person-supervisor-university/" + person_supervisor_university_id);
            if (!res.data.error) {
                fetchPersonSupervisorUniversitiesByPersonId(user.person_id)
            };
        } catch (err) {
            console.log(err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = personSupervisorUniversity => {
        if (personSupervisorUniversity.person_supervisor_university_id === currentPersonSupervisorUniversity.person_supervisor_university_id) {
            setCurrentPersonSupervisorUniversity(0);
        } else {
            setCurrentPersonSupervisorUniversity(personSupervisorUniversity);
        };
    };

    const handleUpdate = (e, personSupervisorUniversity) => {
        e.stopPropagation();
        setCurrentPersonSupervisorUniversity(personSupervisorUniversity);
        openModalCrudPersonSupervisor();
    };

    const handleDelete = (e, personSupervisorUniversity) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this supervisor?', text: 'Are you sure you want to delete this supervisor?', action: () => updatePersonSupervisorUniversityIsActive(personSupervisorUniversity.person_supervisor_university_id) });
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>Supervisor</th>
                <th>Orcid Link</th>
                <th>Researchgate Website</th>
                <th>Academic Google</th>
                <th>University</th>
                <th>Personal website from University</th>
                <th>Laboratory or group website</th>
                <th>Institutional email</th>
                <th></th>
            </tr>
        );
    };

    const renderTableRows = personSupervisorUniversity => {
        var classContent = "";
        var classActions = "";

        if (personSupervisorUniversity.person_supervisor_university_id === currentPersonSupervisorUniversity.person_supervisor_university_id) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={personSupervisorUniversity.person_supervisor_university_id} onClick={() => handleExpandir(personSupervisorUniversity)}>
                <td className="head">
                    {renderAvatar(personSupervisorUniversity)}
                    <div className="dropdown">
                        {renderDropDown(personSupervisorUniversity)}
                    </div>
                </td>
                <td className={classContent} data-label='Orcid Link'><Link.Basic href={personSupervisorUniversity.supervisor_orcid_web} /></td>
                <td className={classContent} data-label='Researchgate Website'><Link.Basic href={personSupervisorUniversity.supervisor_research_web} /></td> 
                <td className={classContent} data-label='Academic Google'><Link.Basic href={personSupervisorUniversity.supervisor_academic_web} /></td>

                <td className={classContent} data-label='University'>{personSupervisorUniversity.university_name}</td>
                <td className={classContent} data-label='Personal website from University'><Link.Basic href={personSupervisorUniversity.supervisor_university_web} /></td>
                <td className={classContent} data-label='Laboratory or group website'><Link.Basic href={personSupervisorUniversity.supervisor_university_group_web} /></td>
                <td className={classContent} data-label='Institutional email'>{personSupervisorUniversity.supervisor_university_email}</td>


                <td className={classActions}>{renderActions(personSupervisorUniversity)}</td>
            </tr>  
        );
    };

    const renderAvatar = personSupervisorUniversity => {
        return (
            <div className="avatar-container">
                <Avatar.Letter>{personSupervisorUniversity.supervisor_fullname[0]}</Avatar.Letter>
                <Text.Basic>{personSupervisorUniversity.supervisor_fullname}</Text.Basic>
            </div>
        );
    };

    const renderActions = personSupervisorUniversity => {
        return (
            <div className="td-container">
               {renderDropDown(personSupervisorUniversity)}
            </div>
        );
    };

    const renderDropDown = personSupervisorUniversity => {
        return (
            <DropDown.ButtonIcon family="more">
                <div onClick={e => handleDelete(e, personSupervisorUniversity)}>Delete</div>
                <div onClick={() => console.log("No yet")}>Survey</div>
            </DropDown.ButtonIcon>
        );
    };

    return (
        <Container.Primary>
            <Title.Primary>My Supervisor</Title.Primary>
            {loading
               ?<Loading/>
               :<Container.Table>
                    {personSupervisorUniversities.length === 0
                       ?<Container.NoRows>There is not supervisors yet.</Container.NoRows>
                       :<Table.Basic>
                            <thead>{renderTableHead()}</thead>
                            <tbody>{personSupervisorUniversities.map(personSupervisorUniversity => renderTableRows(personSupervisorUniversity))}</tbody>
                        </Table.Basic>
                    }
                </Container.Table>
            }
            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon onClick={e => handleUpdate(e, defaultPersonSupervisor)} hover family="newFloat"/>

            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />

            {/* CRUD SUPERVISOR UNIVERSITY  ##################################################################################################### */}
            <PersonSupervisorUniversityCrudNa person_id={user.person_id} fetch={fetchPersonSupervisorUniversitiesByPersonId} personSupervisorUniversity={currentPersonSupervisorUniversity} isOpen={isOpenModalCrudPersonSupervisor} close={closeModalCrudPersonSupervisor} /> 
       
        </Container.Primary>
    );
};