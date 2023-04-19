import './App.css';
import ContactList from './components/ContactList';
import 'bulma/css/bulma.min.css';

function App() {
    const ContactLoading = ContactList();
  return (
    <div className='App'>
      <div className='container'>
      <h1>My Contact List</h1>
      <div>
          <div class="field">
            <div className='columns mt-3 is-vcenterec'>
                <div className='column is-one-fifth'>
                    <label class="label">Name</label>
                </div>
                <div className='column'>
                    <div class="control">
                        <input class="input" type="text" placeholder="Text input"/>
                    </div>
                </div>
            </div>
          </div>

          <div class="field">
            <div className='columns mt-3 is-vcenterec'>
                <div className='column is-one-fifth'>
                    <label class="label">Gender</label>
                </div>
                <div className='column'>
                    <div class="control">
                        <input class="input" type="text" placeholder="Text input"/>
                    </div>
                </div>
            </div>
          </div>

          <div class="field">
            <div className='columns mt-3 is-vcenterec'>
                <div className='column is-one-fifth'>
                    <label class="label">Phone Number</label>
                </div>
                <div className='column'>
                    <div class="control">
                    <input class="input" type="text" placeholder="Text input"/>
                    </div>
                </div>
            </div>
          </div>

          <div class="field">
            <div className='columns mt-3 is-vcenterec'>
                <div className='column is-one-fifth'>
                    <label class="label">Email</label>
                </div>
                <div className='column'>
                    <div class="control">
                    <input class="input" type="text" placeholder="Text input"/>
                    </div>
                </div>
            </div>
          </div>
    
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-link" >Submit</button>
            </div>
          </div>
        </div>
      </div>
      < ContactLoading/>
    </div>
  );

}


export default App;
