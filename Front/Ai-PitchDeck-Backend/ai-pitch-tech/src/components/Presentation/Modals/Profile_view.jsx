// Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const accessToken = localStorage.getItem('access');

            try {
                const response = await axios.get('http://localhost:8000/api/profile/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setProfile(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch profile.');
            }
        };

        fetchProfile();
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>User Profile</h2>
            {profile ? (
                <ul>
                    <li><strong>Username:</strong> {profile.username}</li>
                    <li><strong>Email:</strong> {profile.email}</li>
                </ul>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
