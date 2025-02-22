import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Generate from "./Generate"
import Passwords from "./Passwords"
import { GrLogout } from "react-icons/gr"
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../context/store';
import { logout } from '../context/actions/actions';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MainTabs() {
  const [value, setValue] = React.useState<number>(0);
  const dispatch: AppDispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleLogout = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await dispatch(logout())
    if (response?.payload?.success) {
      navigate('/login')
      toast.success(response.payload.message)
    }
  }

  return (
    <Box sx={{ width: '100%' }} className="bg-cyan-950 text-white">
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Generate Password" />
        <Tab label="Stored Passwords" />
        <div
          onClick={handleLogout}
          className="cursor-pointer absolute top-2 right-4 bg-green-600 p-2 rounded-full flex items-center justify-center size-9">
          <GrLogout />
        </div>
      </Tabs>
      {value ? <Passwords /> : <Generate />}
    </Box>
  );
}