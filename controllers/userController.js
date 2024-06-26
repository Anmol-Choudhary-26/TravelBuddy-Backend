import express from 'express';
const router = express.Router();
import {PrismaCLient} from '@prisma/client'

// Create a new user
async function createUser(email, phoneNumber, FullName, Password) {
    const user = await prisma.user.create({
      data: {
        email,
        phoneNumber,
        FullName,
        Password,
      },
    });
  
    return user;
  }
  
  // Get all users
  async function getAllUsers() {
    const users = await prisma.user.findMany();
  
    return users;
  }
  
  // Get a single user by ID
  async function getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
  
    return user;
  }
  
  // Update a user by ID
  async function updateUserById(id, email, phoneNumber, FullName, Password, shortBio, Address, block) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        email,
        phoneNumber,
        FullName,
        Password,
        shortBio,
        Address,
        block,
      },
    });
  
    return user;
  }
  
  // Delete a user by ID
  async function deleteUserById(id) {
    await prisma.user.delete({
      where: { id },
    });
  }