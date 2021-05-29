const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            uppercase: true,
            maxlength: 50
        },

        lastname: {
            type: String,
            required: true,
            uppercase: true,
            maxlength: 50
        },

        curp: {
            type: String,
            required: true,
            uppercase: true,
            validate: /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
           
        },

        create_date: {
            type: Date,
            required: true,
            Date:Date.now()
        },

        controlnumber: {
            type: String,
            required: true,
            unique: true
        },

        grade: {
            type: Number,
            required: true,
            min:0,
            max:100
        },

        career: {
            type: String,
            required: true,
            values: ['ISC','IM','IGE','IC']
        }


    }
);

const escolaresModel = mongoose.model('Escolares', schema, 'escolares');

module.exports = escolaresModel;