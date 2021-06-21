import { Title, Container, ButtonFloat, Loading, Table, DropDown, Avatar, Dialog, Link, Text, PersonUniversityCrudNa } from "../../../component";
import { useState, useEffect} from "react";
import { getList } from '../../../helpers/listHelper';
import useModal from "../../../hooks/useModal";
import axios from '../../../config/axios'
import useAppContext from '../../../hooks/useAppContext';

export default function PersonUniversityListU() {
    // CONTEXT ######################################################################################################################################
    const { user } = useAppContext();

    // EFFECT #######################################################################################################################################
    useEffect(() => {
        fetchPersonUniversitiesByPersonId(user.person_id);
    }, [user]);

    // CONST ########################################################################################################################################
    const defaultPersonUniversity = {person_university_id: 0, university_id: "", person_university_is_phd_finish: false, phd_finish_year_id: "", phd_current_year_id: "", person_university_web: ""};

    // MODAL ########################################################################################################################################
    const [isOpenModalCrudPersonUniversity, openModalCrudPersonUniversity, closeModalCrudPersonUniversity] = useModal();  

    // STATE ########################################################################################################################################
    const [personUniversities, setPersonUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPersonUniversity, setCurrentPersonUniversity] = useState({});
    const [dialogOptions, setDialogOptions] = useState({});

    // FETCHS #######################################################################################################################################
    const fetchPersonUniversitiesByPersonId = async person_id => {
        setLoading(true);
        const personUniversities = await getList("person-university/" + person_id);
        setPersonUniversities(personUniversities);
        setLoading(false);
    };

    // CRUD #########################################################################################################################################
    const updatePersonUniversityIsActive = async person_university_id => {
        try {
            const res = await axios.put("person-university/" + person_university_id);
            if (!res.data.error) {
                fetchPersonUniversitiesByPersonId(user.person_id)
            };
        } catch (err) {
            console.log(err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleExpandir = personUniversity => {
        if (personUniversity.person_university_id === currentPersonUniversity.person_university_id) {
            setCurrentPersonUniversity(0);
        } else {
            setCurrentPersonUniversity(personUniversity);
        };
    };

    const handleUpdate = (e, personUniversity) => {
        e.stopPropagation();
        setCurrentPersonUniversity(personUniversity);
        openModalCrudPersonUniversity();
    };

    const handleDelete = (e, personUniversity) => {
        e.stopPropagation();
        setDialogOptions({family: "delete", title: 'Delete this supervisor?', text: 'Are you sure you want to delete this supervisor?', action: () => updatePersonUniversityIsActive(personUniversity.person_university_id) });
    };

    // RENDERS ######################################################################################################################################
    const renderTableHead = () => {
        return (
            <tr>
                <th>University</th>
                <th>PhD FInished?</th>
                <th>Any web</th>
                <th>State</th>
                <th></th>
            </tr>
        );
    };

    const renderTableRows = personUniversity => {
        var classContent = "";
        var classActions = "";

        if (personUniversity.person_university_id === currentPersonUniversity.person_university_id) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={personUniversity.person_university_id} onClick={() => handleExpandir(personUniversity)}>
                <td className="head">
                    {renderAvatar(personUniversity)}
                    <div className="dropdown">
                        {renderDropDown(personUniversity)}
                    </div>
                </td>
                <td className={classContent} data-label='PhD FInished?'>{personUniversity.person_university_is_phd_finish_name}</td>
                <td className={classContent} data-label='Any website'><Link.Basic href={personUniversity.person_university_web} /></td>
                <td className={classContent} data-label='State'>{personUniversity.state_name}</td>
                <td className={classActions}>{renderActions(personUniversity)}</td>
            </tr>  
        );
    };

    const renderAvatar = personUniversity => {
        return (
            <div className="avatar-container">
                <Avatar.Letter>{personUniversity.university_name[0]}</Avatar.Letter>
                <Text.Basic>{personUniversity.university_name}</Text.Basic>
            </div>
        );
    };

    const renderActions = personUniversity => {
        return (
            <div className="td-container">
               {renderDropDown(personUniversity)}
            </div>
        );
    };

    const renderDropDown = personUniversity => {
        return (
            <DropDown.ButtonIcon family="more">
                {personUniversity.state_id === 2 && <div onClick={e => handleUpdate(e, personUniversity)}>Update</div>}
                <div onClick={e => handleDelete(e, personUniversity)}>Delete</div>
            </DropDown.ButtonIcon>
        );
    };

    return (
        <Container.Primary>
            <Title.Primary>My University</Title.Primary>
            {loading
               ?<Loading/>
               :<Container.Table>
                    {personUniversities.length === 0
                       ?<Container.NoRows>There is not Universities yet.</Container.NoRows>
                       :<Table.Basic>
                            <thead>{renderTableHead()}</thead>
                            <tbody>{personUniversities.map(personUniversity => renderTableRows(personUniversity))}</tbody>
                        </Table.Basic>
                    }
                </Container.Table>
            }
            {/* NEW  ################################################################################################################################ */}
            <ButtonFloat.Icon onClick={e => handleUpdate(e, defaultPersonUniversity)} hover family="newFloat"/>

            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />

            {/* CRUD SUPERVISOR UNIVERSITY  ##################################################################################################### */}
            <PersonUniversityCrudNa user={user} fetch={fetchPersonUniversitiesByPersonId} personUniversity={currentPersonUniversity} isOpen={isOpenModalCrudPersonUniversity} close={closeModalCrudPersonUniversity} /> 
       
        </Container.Primary>
    );
};