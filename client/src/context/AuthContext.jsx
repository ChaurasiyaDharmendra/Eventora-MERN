import React, { createContext, useState, useEffect } from 'react';

import api from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const userInfo = localStorage.getItem('userInfo');

        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }

        setLoading(false);

    }, []);


    // LOGIN
    const login = async (email, password) => {

        try {

            const { data } = await api.post('/auth/login', {
                email,
                password
            });

            setUser(data);

            localStorage.setItem(
                'userInfo',
                JSON.stringify(data)
            );

            localStorage.setItem('token', data.token);

            return data;

        } catch (error) {

            if (error.response?.data?.needsVerification) {
                throw error.response.data;
            }

            throw error.response?.data?.message || 'Login failed';
        }
    };


    // REGISTER
    const register = async (name, email, password) => {

        try {

            const { data } = await api.post('/auth/register', {
                name,
                email,
                password
            });

            return data;

        } catch (error) {

            throw error.response?.data?.message ||
                'Registration failed';
        }
    };


    // ACCOUNT VERIFICATION OTP
    const verifyOTP = async (email, otp) => {

        try {

            const { data } = await api.post('/auth/verify-otp', {
                email,
                otp
            });

            setUser(data);

            localStorage.setItem(
                'userInfo',
                JSON.stringify(data)
            );

            localStorage.setItem('token', data.token);

            return data;

        } catch (error) {

            throw error.response?.data?.message ||
                'OTP verification failed';
        }
    };


    // FORGOT PASSWORD - SEND OTP
    const forgotPassword = async (email) => {

        try {

            const { data } = await api.post(
                '/auth/forgot-password',
                { email }
            );

            return data;

        } catch (error) {

            throw error.response?.data?.message ||
                'Failed to send OTP';
        }
    };


    // FORGOT PASSWORD - VERIFY OTP
    const verifyForgotOTP = async (email, otp) => {

        try {

            const { data } = await api.post(
                '/auth/verify-forgot-otp',
                {
                    email,
                    otp
                }
            );

            return data;

        } catch (error) {

            throw error.response?.data?.message ||
                'Invalid or expired OTP';
        }
    };


    // FORGOT PASSWORD - RESET PASSWORD
    const resetPassword = async (
        email,
        otp,
        newPassword
    ) => {

        try {

            const { data } = await api.post(
                '/auth/reset-password',
                {
                    email,
                    otp,
                    newPassword
                }
            );

            return data;

        } catch (error) {

            throw error.response?.data?.message ||
                'Failed to reset password';
        }
    };


    // LOGOUT
    const logout = () => {

        setUser(null);

        localStorage.removeItem('userInfo');

        localStorage.removeItem('token');
    };


    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                verifyOTP,
                forgotPassword,
                verifyForgotOTP,
                resetPassword,
                logout,
                loading
            }}
        >

            {!loading && children}

        </AuthContext.Provider>

    );
};