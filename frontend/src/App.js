import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [profileData, setProfileData] = useState({});
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // Retrieve and set the profile data
  useEffect(() => {
    // Make a request to retrieve the profile data
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile?email=${loginEmail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error(response.statusText);
        }
    
        const data = await response.json();
        setProfileData(data);
    
        // Set the profile data in the state variables
        setAge(data.age);
        setGender(data.gender);
        setDob(data.dob);
        setMobile(data.mobile);
      } catch (error) {
        console.error('Error retrieving profile data:', error);
      }
    };
       

    if (loggedIn) {
      fetchProfileData();
    }
  }, [loggedIn, loginEmail]);


  const handleSignup = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const response = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.status === 200) {
      setLoggedIn(false);
      setShowLoginForm(true); // Show login form after successful signup
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Perform client-side validation

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.status === 200) {
      setLoggedIn(true);
      setName(data.name);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
  
    // Perform client-side validation if needed

    try{
      const response = await fetch(`http://localhost:5000/api/profile?email=${loginEmail}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: loginEmail, age, gender, dob, mobile }),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setMessage(data.message);
      setProfileData(data.profile); 
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('An error occurred'); // Update the error message in the state
    }
  };
  
  

  const handleLogout = () => {
    setLoggedIn(false);
    setShowLoginForm(false);
  };

  const renderSignupForm = () => (
    <>
      <h2>Sign Up</h2>
      <form className="style-form" onSubmit={handleSignup}>

        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="cpassword">Confirm Password:</label>
        <input
          id="cpassword"
          name="cpassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <br></br>

        <button className="form-button" type="submit">Sign Up</button>

        <br></br>
      </form>
      {message && <p className='style-form-message'>{message}</p>}
    </>
  );

  const renderLoginForm = () => (
    <>
      <h2>Login</h2>
      <form className="style-form" onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={loginPassword} 
          onChange={(e) => setLoginPassword(e.target.value)}
          required
        />
        <br></br>
        <button className="form-button" type="submit">Login</button>
      </form>
      {message && <p className='style-form-message'>{message}</p>}
    </>
  );

  const renderProfileForm = () => {
    if (showUpdateForm || !profileData || (!profileData.age && !profileData.gender && !profileData.dob && !profileData.mobile)) {
      // Show update form or display welcome message with input fields
      return (
        <>
          <h2>Welcome {name}!</h2>
          <p>Please update your profile details</p>
          <form className="style-form" onSubmit={handleProfileUpdate}>
            <label htmlFor="age">Age:</label>
            <input type="text" id="age" name="age" value={age} onChange={(e) => setAge(e.target.value)} />
  
            <label htmlFor="gender">Gender:</label>
            <input type="text" id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)} />
  
            <label htmlFor="dob">Date of Birth:</label>
            <input type="text" id="dob" name="dob" value={dob} onChange={(e) => setDob(e.target.value)} />
  
            <label htmlFor="mobile">Mobile:</label>
            <input type="text" id="mobile" name="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            <br></br>
  
            <button className="form-button" type="submit">Update Profile</button>
            <br></br>
          </form>
          {message && <p className='style-form-message'>{message}</p>}
        </>
      );
    } else {
      // Display profile details
      return (
        <>
          <h2>Welcome {name}!</h2>
          <div className='profile-details'>
            <p>Your details are as follows:</p>
            {profileData.age && <p>Age: {profileData.age}</p>}
            {profileData.gender && <p>Gender: {profileData.gender}</p>}
            {profileData.dob && <p>Date of Birth: {profileData.dob}</p>}
            {profileData.mobile && <p>Mobile: {profileData.mobile}</p>}
          </div>
          <br></br>
          <button className="form-button" onClick={() => setShowUpdateForm(true)}>Update Profile</button>
        </>
      );
    }
  };
  


  

  return (
    <div className="App">
      <h1>Registration</h1>
      {!loggedIn && !showLoginForm && (
        <>
          {renderSignupForm()}
          <p>Already have an account?</p>
          <button className="form-button" onClick={() => setShowLoginForm(true)}>Login</button>
        </>
      )}
      {!loggedIn && showLoginForm && (
        <>
          {renderLoginForm()}
          <p>Don't have an account?</p>
          <button className="form-button" onClick={() => setShowLoginForm(false)}>Sign Up</button>
        </>
      )}
      {loggedIn && renderProfileForm()}
      {loggedIn && <button className="form-button" onClick={handleLogout}>Logout</button>}
    </div>
  );
  
  
}

export default App;
