import React from 'react';

import ProfileForm from './profileForm';

class Profile extends React.Component {
    render() {
        return (
            <main className="container">
                <div className="profile_header">
                    <img className="profile_icon" src='/static/react/ui/images/profile_icon.png'/>
                    <h1 className="profile_title">Profile</h1>
                </div>
                <p className="profile_subtitle">Edit your account details here!</p>
                <ProfileForm/>
            </main>
        )
    }
}

export default Profile
