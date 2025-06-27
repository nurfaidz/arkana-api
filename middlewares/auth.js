const express = require('express')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    // get token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) 
        return res.status(401).json({message: 'Unauthenticated'});

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({message: 'Invalid token'});
        req.userId = decoded.id;
        next();
    })
}

module.exports = verifyToken;