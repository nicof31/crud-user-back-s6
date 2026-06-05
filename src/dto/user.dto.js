import Joi from "joi";
const createUserSchema = Joi.object({
  nombre: Joi.string().required(),
  apellido: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fechaNacimiento: Joi.date().required(),
  edad: Joi.number().required(),
  sexo: Joi.string().required(),
  telefono: Joi.string().required(),
  direccion: Joi.string().required(),
  localidad: Joi.string().required(),
  provincia: Joi.string().required(),
  pais: Joi.string().required(),
  codigoPostal: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  nombre: Joi.string(),
  apellido: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  fechaNacimiento: Joi.date(),
  edad: Joi.number(),
  sexo: Joi.string(),
  telefono: Joi.string(),
  direccion: Joi.string(),
  localidad: Joi.string(),
  provincia: Joi.string(),
  pais: Joi.string(),
  codigoPostal: Joi.string(),
});

const userParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
export { createUserSchema, updateUserSchema, userParamsSchema };
