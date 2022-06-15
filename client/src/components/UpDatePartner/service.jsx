import { useState } from "react";
import styles from "./style/client.module.css";
import {
  serviceValidate,
  serviceValidateEdit,
} from "./controlers/validaciones";
import { useSelector } from "react-redux";
import { getMyGyms } from "../../redux/actions"; // --------------LA ACTION
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { createService } from "../../redux/actions";
import { SweetAlrt, SweetAlrtTem } from "../../asets/helpers/sweetalert";
import { createOneService, editOneService } from "./controlers/Functions";
import { useEffect } from "react";

export default function Services() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const dataPartner = useSelector((state) => state.myGyms);
  let myGyms = dataPartner.gyms ? dataPartner.gyms : [];
  let filterServices = [];
  let dataEditService;

  const [myServices, setMyServices] = useState([]);
  const [dataService, setDataService] = useState({}); // A ver si puedo tomar la info
  const userId = localStorage.getItem('userId');

  const [typeAction, setTypeAcyion] = useState("create");
  // const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [gymId, setGymId] = useState("");
  const [serviceId, setServiceId] = useState("");

 const [newService, setNewService] = useState({
   name: "", // string requerido
   description: "", // string requerido
   duration: "", // numero en minutos
   price: "", // numero requerido
   photo: [], // Array de strings
   profileCategory: [],
 });

  const [editService, setEditService] = useState({
    name: "", // string requerido
    description: "", // string requerido
    duration: "", // numero en minutos
    price: "", // numero requerido
    photo: [], // Array de strings
    profileCategory: [],
  });

  const [error, setError] = useState({});

  useEffect(() => {
    dispatch(getMyGyms(userId))
  }, [userId]);


  function refreshState(e) {
    e.preventDefault();
    dispatch(getMyGyms(userId))

  }


  //----------------------------------------------------------------------------
  // Esta función sirve para crear un gym           
  //----------------------------------------------------------------------------
  async function onClickCreateService() {
    if (error.name || error.description || error.price) {
      return SweetAlrtTem("Los valores ingresados son incorrectos", "warning");
    } else if (
      !newService.name ||
      !newService.description ||
      !newService.price
    ) {
      return SweetAlrtTem("Completa los campos  minimo requeridos", "warning");
    } else {
      let dataForNewService = {
        gymId: { gymId: gymId },
        dataNewService: newService,
      };

      // gymId: el id del gym que crea el servicio
      // dataNewService: en este objeto va todo lo que obtienen del formulario (el input de arriba)

      console.log("recibe el click y crea un service");
      let newOnService = await createOneService(dataForNewService);
      SweetAlrt("Exito", "Servicio creado", "success");

      return newOnService;
    }
  }


  //----------------------------------------------------------------------------
  // Esta función sirve para editar la info de un gym       
  //----------------------------------------------------------------------------

  async function onClickEditService() {
    if (error.name || error.description || error.price) {
      return SweetAlrtTem("Los valores ingresados son incorrectos", "warning");
    } else if (
      !editService.name &&
      !editService.description &&
      !editService.price
    ) {
      return SweetAlrtTem("Completa los datos minimos requeridos", "warning");
    } else {
      let dataForEditService = {
        serviceId: { serviceId: serviceId },
        newDataService: editService,
      };

      // serviceId: el id del service a editar
      // dataNewService: en este objeto va todo lo que obtienen del formulario (el input de arriba)

      console.log("recibe el click y edita un gym");
      let editOnService = await editOneService(dataForEditService);
      SweetAlrt("Exito", "Servicio editado", "success");
      return editOnService;
    }
  }

  //----------------HANDLECHANGE----------------------------------------------
 function handleChange(e) {
   if (typeAction === "create") {
     setNewService(() => {
       const newInput = {
         ...newService,
         [e.target.name]: e.target.value,
       };
       const errors = serviceValidate(newInput);
       setError(errors);
       console.log(newInput);
       console.log(errors);
       return newInput;
     });
   }

   if (typeAction === "edit") {
     setEditService(() => {
       const newInput = {
         ...editService,
         [e.target.name]: e.target.value,
       };
       const errors = serviceValidateEdit(newInput);
       setError(errors);
       console.log(newInput);
       console.log(errors);
       return newInput;
     });
   }
 }

  function handleChangeGyms(e) {
    if (e.target.value !== "...") {
      e.preventDefault();
      let value = e.target.value;
      //
      // let myGyms = dataPartner.gyms ? dataPartner.gyms : [];
      console.log(myGyms);

      filterServices = myGyms.length && myGyms.filter(e => e._id === value);

      setMyServices(filterServices);

      console.log(filterServices, ' los servicios del gym');

      // Seteamos el id del servicio
      setGymId(e.target.value);
      // console.log(e.target.value, ' Service select dentro del if')

    } else {
      setGymId("");
    }
    console.log(e.target.value, ' Service select')
  }

  function handleChangeService(e) {
    if (e.target.value !== "...") {
      e.preventDefault();
      // Seteamos el id del servicio
      setServiceId(e.target.value);
      // console.log(e.target.value, ' Service update select dentro del if ')
      dataEditService = myServices;
      console.log(dataEditService, 'luego de seleccionar un sevice')

    } else {
      setServiceId("");
    }
    console.log(e.target.value, ' Service update en el select')
  }


  function addPhoto(e) {
    e.preventDefault();

    if (photo && typeAction === "create") {

      if (!newService.photo.includes(photo)) {
        // console.log('entra');
        let newState = [...newService.photo]
        newState.push(photo);

        setNewService({
          ...newService,
          photo: newState,
        });
      }
    }
    if (photo && typeAction === "edit") {

      if (!editService.photo.includes(photo)) {
        let newState = [...editService.photo]
        newState.push(photo);

        setEditService({
          ...editService,
          photo: newState,
        });
      }
    }
    // console.log(editGym.image)
    // console.log(newGym.image)
    setPhoto("");

  }

  //----------------------- delete photo --------------------------------------
  function handleDeletePhoto(e) {
    e.preventDefault();

    if (typeAction === "create") {
      setNewService({
        ...newService,
        photo: newService.photo.filter((el) => el !== e.target.value),
      });
    }

    if (typeAction === "edit") {
      setEditService({
        ...editService,
        photo: editService.photo.filter((el) => el !== e.target.value),
      });
    }

  }

  // function validatePlanServices (userPlan, partnerGyms) {
  //   // userPlan es un string o un booleano-> false || "Premium" ||  
  //   // "Estandar" || "Golden"
  //   // parnerGys -> Es un arreglo de objetos (un objeto por cada gym)
  //   let planType;
  //   let maxGyms;
  //   if (userPlan === false ) { // si el usuario no tiene plan
  //     return `La cuenta no tiene asignado un plan, no puede crear un gimnasios`;      
  //   }
  //   planType = userPlan.planName;
  //   maxGyms = userPlan.gymsPermited
  //   // console.log(planType, maxGyms, 'plan del user y cantidad de gyms')
    
  //   // if (planType === "Estandar" && partnerGyms.length === 1 ) { // Máximo un gym, nada más
  //   if (planType === "Estandar" && partnerGyms.length === Number(maxGyms) ) { // De pruebaa, el que vale es el que sigue
  //     return `La cuenta Estandar solo permite crear un gimnasio,
  //     si desea crear más de un gimnasio debería cambiar de plan.`;
  //   }
  //   if (planType === "Premium" && partnerGyms.length === Number(maxGyms) ) {      
  //     return `La cuenta Premium solo permite crear hasta cinco gimnasio,
  //     si desea crear más gimnasios debería cambiar de plan.`;
  //   }
  //   if (planType === "Golden" && partnerGyms.length === Number(maxGyms) ) {     
  //     return `La cuenta Golden le permite crear un máximo de cincuenta gimnasios,
  //     no es posible crear más gimnasios.`;
  //   }    

  //   return true;    

  // }















  return (

    <div className={styles.editPartnerMainContainer}>
      <h3>FORMULARIO DE {typeAction === "create" ? "CREACIÓN" : "EDICIÓN"} DE PRODUCTO O SERVICIO</h3>
      <div>

      {typeAction === "edit" ? 
        <button onClick={() => { setTypeAcyion("create") }}>Ir a crear Servicio</button>
        : null  }

      {typeAction === "edit" ? null :
        <button onClick={() => { setTypeAcyion("edit") }}>Ir a editar Servicio</button>
      }

        <p></p>
        <p></p>
        {/* {typeAction ? typeAction : null} */}

        <button onClick={(e) => refreshState(e)}>Recargar</button>

        <form action="">

          <div>
            <label><strong>*</strong>Gimnasio: </label>
            <select onChange={(e) => handleChangeGyms(e)}>
              <option key="id1">...</option>
              {myGyms.length > 0 ? myGyms.map((g) => (
                <option key={g._id} value={g._id}>{g.name}</option>
              )) : null}
            </select>
            {/* {gymId ? gymId : null} */}
          </div>

          {typeAction === "edit" ?

            <div>
              <label><strong>*</strong>Servicio: </label>
              <select onChange={(e) => handleChangeService(e)}>
                <option key="id2">...</option>
                {myServices.length > 0 && myServices[0].services.length > 0 ? myServices[0].services.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                )) : null}
              </select>
              {/* {serviceId ? serviceId : null} */}
            </div>


            : null}



          <div>
            <label>
              <strong>*</strong>Nombre:{" "}
            </label>
            <input
              className={error.name && styles.inputdanger}
              type="text"
              name="name"
              value={typeAction === "create" ? newService.name : editService.name}
              onChange={(e) => {
                handleChange(e);
              }}
              placeholder="Nombre del servicio..."
            />
            {error.name && <p className={styles.danger}>{error.name}</p>}
          </div>

          <div>
            <label><strong>*</strong>Descripcion: </label>
            <input
              className={error.description && styles.inputdanger}
              onChange={(e) => handleChange(e)}
              value={typeAction === "create" ? newService.description : editService.description}
              type="text"
              name="description"
              placeholder="Una breve descripcion..."
            />{" "}
            {error.description && (
              <p className={styles.danger}>{error.description}</p>
            )}
            {typeAction === "create" ? <p>{newService.description}</p> : <p>{editService.description}</p>}
          </div>

          <div>
            <label>
              <strong>*</strong>Precio:{" "}
            </label>
            <input
              className={error.name && styles.inputdanger}
              type="number"
              name="price"
              value={typeAction === "create" ? newService.price : editService.price}
              onChange={(e) => {
                handleChange(e);
              }}
              placeholder="$..."
            />
            {error.price && <p className={styles.danger}>{error.price}</p>}
          </div>

          <div>
            <label><strong>*</strong>Fotos: </label>

            <input
              type="text"
              name="photo"
              id="image"
              multiple
              value={photo}
              onChange={(e) => { setPhoto(e.target.value) }}
              placeholder="https://foto-del-gym.jpg"
            />
            <button onClick={(e) => { addPhoto(e) }}> + </button>


            <ul>
              <li className={styles.input}>
                {newService.photo.length && typeAction === "create" ? newService.photo.map((e) => (
                  <div key={e}>

                    <img className={styles.photoform}
                      src={e}
                      key={e}
                      alt="No Found"
                    />
                    <button value={e} onClick={(e) => handleDeletePhoto(e)}>
                      x
                    </button>{" "}
                  </div>
                )) : null}

                {editService.photo.length && typeAction === "edit" ? editService.photo.map((e) => (
                  <div key={e}>

                    <img className={styles.photoform}
                      src={e}
                      key={e}
                      alt="No Found"
                    />
                    <button value={e} onClick={(e) => handleDeletePhoto(e)}>
                      x
                    </button>{" "}
                  </div>
                )) : null}
              </li>
            </ul>
          </div>

          <div>
            <label>Duracion:</label>
            <input className='inputScore' type="range" name="duration"
              min="1" max="90" step="1"
              value={typeAction === "create" ? newService.duration : editService.duration}
              // onClick={(e) => validateSubmit(e)}
              onChange={(e) => handleChange(e)}
            />
            {typeAction === "create" && newService.duration ? `${newService.duration} minutos` : null}
            {typeAction === "edit" && editService.duration ? `${editService.duration} minutos` : null}

            {error.duration && <p className={styles.danger}>{error.duration}</p>}

          </div>

        </form>

      </div>
      <p></p>
      {typeAction === "create" &&
        <button onClick={(e) => { onClickCreateService(e) }}>Crear servicio de prueba</button>
      }
      {typeAction === "edit" &&
        <button onClick={(e) => { onClickEditService(e) }}> Editar servicio de prueba</button>
      }

    </div>
  );
}