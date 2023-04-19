import './ContactList.css';
import React, { useEffect, useState } from 'react';
import WithListLoading from './WithListLoading';
import LoadContactList from '../LoadContactList';
import 'bulma/css/bulma.min.css';


function ContactList() {


  const [appState, setAppState] = useState({
    loading: false,
    contacts: null,
  });

  const ListLoading = WithListLoading(LoadContactList());

  useEffect(() => {
    setAppState({ loading: true });
    const apiUrl = `http://localhost:8080/api/contacts`;
    var data = {
        'username': 'test', 
        'password' : '123456789', 
        'role': 'admin'
    };
    
    var formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch(apiUrl, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        headers: {
          //"Content-Type": "application/json",
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'username': 'test', 
            'password' : '123456789', 
            'role': 'admin'
        }),
      })
      .then((res) => res.json())
      .then((contacts) => {
        setAppState({ loading: false, contacts: contacts });
      });
  }, [setAppState]);

  return(
    <div className='contact-container'>
    <ListLoading isLoading={appState.loading} contacts={appState.contacts} />
  </div>
  )



}
export default ContactList;
