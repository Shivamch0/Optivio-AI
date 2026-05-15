import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";

// Utils Imports
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js';


const registeUser = asyncHandler ( async (req , res) => {});
const loginUser = asyncHandler ( async (req , res) => {});
const logoutUser = asyncHandler ( async (req , res) => {});
const getCurrentUser = asyncHandler ( async (req , res) => {});
const refreshAccessToken = asyncHandler ( async (req , res) => {});
const changeCurrentPassword = asyncHandler ( async (req , res) => {});
const updateAccountDetails = asyncHandler ( async (req , res) => {});

export { registeUser , loginUser , logoutUser , getCurrentUser , refreshAccessToken , changeCurrentPassword , updateAccountDetails }