import React from 'react'
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile } from '../services/apiService';

const LocationHandler = () => {
    const { user } = useAuth();

    useEffect(() => {
        if (user && !user.user_profile?.latitude) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("Location obtained:", { latitude, longitude });
                    updateMyProfile({ latitude, longitude }).catch(err => {
                        console.error("Failed to save user location:", err);
                    });
                },
                (error) => {
                    console.warn("User denied location access:", error.message);
                }
            );
        }
    }, [user]);

    return null;
}

export default LocationHandler