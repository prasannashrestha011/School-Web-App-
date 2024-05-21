import {useContext} from 'react'
import { AdminContext } from '../context/admincontext'
const AdminHook=()=>{

    return( useContext(AdminContext))
}
export default AdminHook