import React, { useEffect, useState } from 'react';
import ContactList from './components/ContactList';

const LoadContactList = (props) => {
    const { contacts } = props;
    console.log(contacts);
    if (!contacts || contacts.length === 0) return <p>No contacts, sorry</p>;
    return (
      <ul>
        <h2 className='list-head'>Contacts Retrieved</h2>
        {contacts.data.map((contact, i) => {
          return (
            <div key={i} className='contact-list has-text-left is-vcentered'>
              <div className='contact-id' >ID: {contact._id} </div>
              <div className='contact-name'>Name: {contact.name} </div>
              <div className='contact-gender'>Gender: {contact.gender}</div>
              <div className='contact-phone'>Phone: {contact.phone}</div>
              <div className='contact-email'>Email: {contact.email} </div>
              <div class="buttons">
                <button class="button is-danger">Delete</button>
              </div>
            </div>
          );
        })}
      </ul>
    );
  };

  export default LoadContactList;