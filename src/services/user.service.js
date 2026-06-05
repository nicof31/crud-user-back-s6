import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

import Audit from "../models/audit.model.js";

import mongoose from "mongoose";

const getUsersService = async () => {
  try {
    console.log("📦 SERVICE → getUsersService");

    const users = await User.find().select("-password");

    return users;
  } catch (error) {
    throw error;
  }
};

const createUserService = async (data) => {
  try {
    console.log("📦 SERVICE → createUserService");

    console.log(data);

    const existUser = await User.findOne({
      email: data.email,
    });

    if (existUser) {
      throw new Error("El usuario ya existe");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new User({
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      password: hashedPassword,
      fechaNacimiento: data.fechaNacimiento,
      edad: data.edad,
      sexo: data.sexo,
      telefono: data.telefono,
      direccion: data.direccion,
      localidad: data.localidad,
      provincia: data.provincia,
      pais: data.pais,
      codigoPostal: data.codigoPostal,
    });

    await user.save();

    return {
      id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      fechaNacimiento: user.fechaNacimiento,
      edad: user.edad,
      sexo: user.sexo,
      telefono: user.telefono,
      direccion: user.direccion,
      localidad: user.localidad,
      provincia: user.provincia,
      pais: user.pais,
      codigoPostal: user.codigoPostal,
    };
  } catch (error) {
    throw error;
  }
};

const updateUserService = async (id, data) => {
  try {
    console.log("📦 SERVICE → updateUserService");

    console.log(id);
    console.log(data);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Usuario no encontrado");
    }

    const user = await User.findById(id);

    // NO permitir cambiar email
    if (data.email) {
      throw new Error("El email no puede modificarse");
    }

    // Update parcial
    if (data.nombre) user.nombre = data.nombre;

    if (data.apellido) user.apellido = data.apellido;

    if (data.fechaNacimiento) user.fechaNacimiento = data.fechaNacimiento;

    if (data.edad) user.edad = data.edad;

    if (data.sexo) user.sexo = data.sexo;

    if (data.telefono) user.telefono = data.telefono;

    if (data.direccion) user.direccion = data.direccion;

    if (data.localidad) user.localidad = data.localidad;

    if (data.provincia) user.provincia = data.provincia;

    if (data.pais) user.pais = data.pais;

    if (data.codigoPostal) user.codigoPostal = data.codigoPostal;
    // Cambiar password si viene
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }

    await user.save();

    return {
      id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      fechaNacimiento: user.fechaNacimiento,
      edad: user.edad,
      sexo: user.sexo,
      telefono: user.telefono,
      direccion: user.direccion,
      localidad: user.localidad,
      provincia: user.provincia,
      pais: user.pais,
      codigoPostal: user.codigoPostal,
    };
  } catch (error) {
    throw error;
  }
};

const deleteUserService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Usuario no encontrado");
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const user = await User.findById(id).session(session);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      await Audit.create(
        [
          {
            usuarioEliminado: user.toObject(),
            fechaEliminacion: new Date(),
          },
        ],
        { session },
      );

      await user.deleteOne({ session });
    });

    return {
      message: "Usuario eliminado",
    };
  } finally {
    await session.endSession();
  }
};

export {
  getUsersService,
  createUserService,
  updateUserService,
  deleteUserService,
};
