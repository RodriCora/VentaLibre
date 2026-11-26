import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from './config';

const COLECCION_PRODUCTOS = 'productos';
const productosRef = collection(db, COLECCION_PRODUCTOS);

export const obtenerProductos = async () => {
  const snapshot = await getDocs(productosRef);
  const lista = snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }));

  return lista.sort((a, b) => {
    const fechaA = a.creadoEn ? new Date(a.creadoEn).getTime() : 0;
    const fechaB = b.creadoEn ? new Date(b.creadoEn).getTime() : 0;
    return fechaB - fechaA;
  });
};

export const obtenerProductoPorId = async (id) => {
  const docRef = doc(db, COLECCION_PRODUCTOS, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const crearProducto = async (producto) => {
  const docRef = await addDoc(productosRef, {
    ...producto,
    price: Number(producto.price),
    creadoEn: new Date().toISOString(),
  });
  return docRef.id;
};

export const actualizarProducto = async (id, datosActualizados) => {
  const docRef = doc(db, COLECCION_PRODUCTOS, id);
  await updateDoc(docRef, {
    ...datosActualizados,
    price: Number(datosActualizados.price),
    actualizadoEn: new Date().toISOString(),
  });
};

export const eliminarProducto = async (id) => {
  const docRef = doc(db, COLECCION_PRODUCTOS, id);
  await deleteDoc(docRef);
};

export const crearOrden = async (orden) => {
  const ordenesRef = collection(db, 'ordenes');
  const docRef = await addDoc(ordenesRef, {
    ...orden,
    fecha: new Date().toISOString(),
  });
  return docRef.id;
};

export const obtenerPerfilUsuario = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, 'usuarios', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const guardarPerfilUsuario = async (uid, datosPerfil) => {
  const userRef = doc(db, 'usuarios', uid);
  await setDoc(
    userRef,
    {
      ...datosPerfil,
      actualizadoEn: new Date().toISOString(),
    },
    { merge: true }
  );
};
