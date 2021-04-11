import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input, Icon, Modal, Button, Select, Table, Container, Loading, Title } from "../../component";
import useModal from "../../hooks/useModal";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { getList } from '../../helpers/listHelper'; 
import axios from '../../config/axios'
import useList from '../../hooks/useList';

const User = () => {
    useEffect(() => fetchUsers(), []);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentUserId, setCurrentUserId] = useState(0);
    const [isOpenModal, openModal, closeModal] = useModal();
    const defaultData = {user_id: 0, name: '', email: '', rol_id: 2};
    const [loading, setLoading] = useState(true);
    const rols = useList("list/rol");
    
    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        name: Yup.string().required('Required'),
        email: Yup.string().email("Invalid format").required('Required')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const openForm = user => {
        setCurrentUserId(user.user_id);
        reset(user);
        openModal();
    };

    /*CRUD ###########################################################################################*/ 
    const fetchUsers = async () => {
        setLoading(true);
        const res = await getList("user");
        setUsers(res);
        setLoading(false);
    };

    const addUser = async data => {
        try {
            const res = await axios.post("user", {user_id: currentUserId, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetchUsers();
                    closeModal();
                    break;
                case 1:
                    alert('Ya existe!');
                    break;
                case 2:
                    alert('Ya existe inactivo!');
                    break;
                default:
                    alert('Otro problema!, error: ' + res.data.result.msg);
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    const staUser = async (id) => {
        try {
            const res = await axios.put("user/" + id);
            if (!res.data.error) {
                fetchUsers();
            };
        } catch (err) {
            console.log(err);
        };
    };

    function filUser(user) {
        if(searchTerm === "") {
            return user;
        } else if (user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return user;
        };
        return null;
    };

    /*JSX ############################################################################################*/ 
    return (
        <Container.Primary>
            <div className="search-container">
                <Input.TextAction name="search" placeholder="Search..." value={searchTerm} action={setSearchTerm} />
                <Icon.Basic family="add" action={() => openForm(defaultData)} right="12px" hover/>
            </div>
            {loading 
                ? <Loading/>
                : <Container.Table>
                    <Table.Primary>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.filter(filUser).map(user => (
                                <tr key={user.user_id}>
                                    <td data-label='Name'>{user.name}</td>
                                    <td data-label='Email'>{user.email}</td>
                                    <td data-label='Rol'>{user.rol_name}</td>
                                    <td data-label='Actions'>
                                        <div className="td-container">
                                            <Icon.Basic family="edit" action={() => openForm(user)} hover/>
                                            <Icon.Basic family="delete" action={() => staUser(user.user_id)} hover/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table.Primary>
                </Container.Table>}
                
            <Modal.ForForm isOpen={isOpenModal} closeModal={closeModal}>
                <Container.Basic>
                    <Title.Basic>{currentUserId === 0 ? 'New User' : 'Update User'}</Title.Basic>
                    <Input.TextValidation name="name" placeholder="Name" register={register} error={errors.name} />
                    <Input.TextValidation name="email" type="email" placeholder="email@email.com" register={register} error={errors.email}/>
                    <Select.TextValidation name="rol_id" type="select" register={register} error={errors.user_type_id} content={rols} />
                    <Input.TextValidation name="password" type="password" register={register} />
                    <Button.Basic action={handleSubmit(addUser)} margin="0 0 10px 0px">Save</Button.Basic>
                </Container.Basic>
            </Modal.ForForm>
           
        </Container.Primary>
    );
};

export default User;