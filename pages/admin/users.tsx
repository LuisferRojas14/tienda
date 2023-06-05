import AdminLayout from '../../components/layouts/AdminLayout'
import  PeopleAltOutlined  from '@mui/icons-material/PeopleAltOutlined'
import { DataGrid,GridColDef, GridRenderCellParams} from '@mui/x-data-grid'
import { Grid, MenuItem, Select } from '@mui/material';
import useSWR from 'swr';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';
import {  useEffect, useState } from 'react';

const UsersPage = () => {

  const {data, error} = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data])

  if (!data && !error) return (<></>);

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const previosUsers = users.map(user => ({...user}));
    const updatedUsers = users.map(user => ({
      ...user,
      role: userId === user._id ? newRole : user.role
    }));
    setUsers(updatedUsers);
    try {
      await tesloApi.put('/admin/users', {userId, role:newRole});
    } catch (error) {
      setUsers(previosUsers);
      console.log(error);
      alert('Error al actualizar el rol del usuario');
    }
  }
  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    { 
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Select
            value={params.row.role}
            label="Rol"
            onChange={({target}) => onRoleUpdated(params.row.id, target.value)}
            sx={{ width: '300px' }}
            >
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='client'>Client</MenuItem>
              <MenuItem value='super-user'>Super User</MenuItem>
              <MenuItem value='SEO'>SEO</MenuItem>
          </Select>
        )
    }
  },
];
    
    
  const rows =  users.map(user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  }))

  return (
  <AdminLayout
    title={"Usuarios"}
    subTitle={"Mantenimiento de Usuarios"}
    icon={<PeopleAltOutlined/>}
    >
    
      <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10} },
                }}/>
            </Grid>
      </Grid>


    </AdminLayout>
  )
}

export default UsersPage
