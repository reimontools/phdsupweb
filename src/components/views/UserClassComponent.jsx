import { Component } from 'react';
import { Table, Loading, Container, Icon, Dialog, Modal, Title } from "../../component";
import { getList } from '../../helpers/listHelper';

class User extends Component {
    // STATE ##############################################################################################################################
    state = {
        loading: true,
        currentUser: 0,
        users: [],
        dialogOptions: {},
        isOpenModal: false
    };

    // CICLE ##############################################################################################################################
    async componentDidMount() {
        const users = await getList("user");
        this.setState({ 
            users: users,
            loading: false
        });
    };

    // RENDERS #########################################################################################################################
    renderTableHead = () => {
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

    renderTableRows = user => {
        var classContent = "";
        var classActions = "";

        if (user.user_id === this.state.currentUser) {
            classContent = "content unhide"
            classActions = "unhide"
        } else {
            classContent = "content hide"
            classActions = "hide"
        };

        return (
            <tr key={user.user_id} onClick={() => this.handleExpandir(user.user_id)}>
                <td className="head">{user.fullname}</td>
                <td className={classContent} data-label='Nickname'>{user.nickname}</td>
                <td className={classContent} data-label='Email'>{user.email}</td>
                <td className={classContent} data-label='Mobile'>{user.mobile_number}</td>
                <td className={classContent} data-label='University'>{user.university_name}</td>
                <td className={classContent} data-label='Rol'>{user.rol_name}</td>
                <td className={classContent} data-label='State'>{user.state_name}</td>
                <td className={classActions}>{this.renderActions(user)}</td>
            </tr>  
        );
    };

    renderActions = user => {
        return (
            <div className="td-container">
                <Icon.Basic 
                    onClick={() => this.handleOpenModalCrud()}
                    family="edit"
                    hover
                />
                <Icon.Basic 
                    onClick={e => this.handleClickOptions(e, user)}
                    family="delete" 
                    hover
                />
            </div>
        );
    };

    // HANDLES #########################################################################################################################
    handleExpandir = id => {
        if (id === this.state.currentUser) {
            this.setState({currentUser: 0});
        } else {
            this.setState({currentUser: id});
        };
    };

    handleClickOptions = (e, obj) => {
        e.stopPropagation();
        // console.log(obj);
        this.setState({dialogOptions: {family: "info", title: 'Wea', text : 'Wea'}});
    };

    handleCloseDialog = () => {
        this.setState({dialogOptions: {}});
    };

    handleOpenModalCrud = () => {
        this.setState({isOpenModal: true});
    };

    handleCloseModalCrud = () => {
        this.setState({isOpenModal: false});
    };

    // JSX #############################################################################################################################
    render() {
        
        return (
            <Container.Primary>
                {this.state.loading 
                    ? <Loading/>
                    : <Container.Table>
                        <Table.Basic>
                            <thead>{ this.renderTableHead() }</thead>
                            <tbody>{ this.state.users.map(user => this.renderTableRows(user)) }</tbody>
                        </Table.Basic>
                    </Container.Table>
                }
            
            {/* MODAL CRUD ############################################################################################################# */}
            <Modal.ForForm isOpen={this.state.isOpenModal} closeModal={() => this.handleCloseModalCrud()}>
                <Container.Basic>
                    <Title.Basic>New User</Title.Basic>
                    {/* <Input.TextValidation name="name" placeholder="Name" register={register} error={errors.name} />
                    <Input.TextValidation name="email" type="email" placeholder="email@email.com" register={register} error={errors.email}/>
                    <Select.Validation name="rol_id" type="select" register={register} error={errors.user_type_id} content={rols} />
                    <Input.TextValidation name="password" type="password" placeholder="Write a password" register={register} />
                    <Button.Basic action={handleSubmit(addUser)} width="100%">Save</Button.Basic> */}
                </Container.Basic>
            </Modal.ForForm>

            {/* DIALOG ################################################################################################################# */}
            <Dialog.Action options={this.state.dialogOptions} close={() => this.handleCloseDialog()} />
            </Container.Primary>
        );
    };
};

export default User;