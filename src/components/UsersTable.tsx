import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Modal,
    Paper,
    Fade,
    Toolbar,
    Dialog,
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { User, UserLocation, createUser } from "@/types/user";
import { useEffect, useState } from "react";
import useApi from "@/features/api/use-api";
import { setUsers, deleteUser } from "@/features/users/state";
import UserEdit from "./UserEdit";

export default function UsersTable() {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const users = useAppSelector((state) => state.users);
    const dispatch = useAppDispatch();

    const api = useApi();

    useEffect(() => {
        api.get('?results=10').then((response) => {
            dispatch(setUsers(response.data.results.map((user: any) => createUser({ ...user, id: user.login.uuid }))));
        });
    }, [api, dispatch]);

    const address = (location: UserLocation) => {
        const { street, city, country } = location;
        return `${street.number} ${street.name}, ${city}, ${country}`;
    }

    const handleEdit = (user?: User) => {
        if (user) {
            setSelectedUser(user);
            setEditModalOpen(true);
        } else {
            setSelectedUser(null);
            setEditModalOpen(true);
        }
    }

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    }

    const handleDeleteConfirm = () => {
        if (selectedUser) {
            dispatch(deleteUser(selectedUser.id));
        }
        setDeleteDialogOpen(false);
    }

    const handleCloseModal = () => {
        setEditModalOpen(false);
    }

    return (
        <>
            <Toolbar>
                <Box sx={{ flexGrow: 1, textAlign: 'end' }}>
                    <Button onClick={() => handleEdit()}>
                        <Add /> Add User
                    </Button>
                </Box>
            </Toolbar>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name.first}</TableCell>
                            <TableCell>{user.name.last}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{address(user.location)}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleEdit(user)}>
                                    <Edit />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(user)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Fade in={editModalOpen}>
                    <Paper elevation={8} sx={{ padding: '2em' }}>
                        {
                            selectedUser ?
                                <UserEdit user={selectedUser} onClose={handleCloseModal} /> :
                                <UserEdit onClose={handleCloseModal} />}
                    </Paper>
                </Fade>
            </Modal>
            <Dialog open={deleteDialogOpen}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
