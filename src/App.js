import React from 'react'
import Center from './components/Center'
import Header from './components/Header'
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation} from 'react-router-dom';
import InvoiceInfo from './components/InvoiceInfo';
import invoiceSlice from './redux/invoiceSlice';
import { useDispatch } from 'react-redux';

function App() {
  const location = useLocation()
  const dispatch = useDispatch()

  const onDelete = (invoiceNumber) => {
    dispatch(invoiceSlice.actions.deleteInvoice({invoiceNumber : invoiceNumber }))
  }

  return (
    <div className='h-full dark:bg-[#141625] duration-300 min-h-screen bg-[#f8f8fb]'>
      <Header />

      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          < Route element={<Center />} path='' />
          < Route element={<InvoiceInfo  onDelete={onDelete} />} path='/invoice' />
        </Routes>
      </AnimatePresence>

    </div>
  )
}

export default App