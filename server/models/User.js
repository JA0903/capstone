import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Users = sequelize.define('user', {
    fullname: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    otp: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    otpExpireAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isVerified: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: false,
        defaultValue: 'no',
    },
    savedJobs: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of job IDs saved by the user'
    }
}, {
    paranoid: true
});

export default Users;
