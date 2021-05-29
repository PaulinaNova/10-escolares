const router = require('express').Router();

const mongoose = require('mongoose');
var status = require('http-status');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/escolares',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Escolares = require('../models/escolares.model');

module.exports = () => {
    /** Insertar */
    router.post('/', (req, res) => {
        escolares = req.body;
        Escolares.create(escolares)
            .then(
                (data) => {
                    res.json(
                        {
                            code: status.OK,
                            msg: 'Se insertó correctamente',
                            data: data
                        }
                    )
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json(
                            {
                                code: status.BAD_REQUEST,
                                msg: 'Ocurrió un error',
                                err: err.name,
                                detal: err.message
                            }
                        )
                }
            );
    });

    /** Consulta general */
    router.get('/', (req, res) => {
        Escolares.find({})
            .then(
                (escolaresn) => {
                    res.json({
                        code: status.OK,
                        msg: 'Consulta correcta',
                        data: escolaresn
                    })
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error en la petición',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    });

    /** Consulta por número de control */
    router.get('/:controlnumber', (req, res) => {
        const ctrl = req.params.controlnumber;
        Escolares.findOne({ controlnumber: ctrl })
            .then(
                (escolares) => {
                    if (escolares)
                        res.json({
                            code: status.OK,
                            msg: 'Consulta correcta',
                            data: escolares
                        });
                    else
                        res.status(status.NOT_FOUND)
                            .json({
                                code: status.NOT_FOUND,
                                msg: 'No se encontró el elemento'
                            });

                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error en la petición',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    });

    /** Eliminar por numero de control */
    router.delete('/:controlnumber', (req, res) => {
        ctrl = req.params.controlnumber;
        Escolares.findOneAndRemove({controlnumber:ctrl})
            .then(
                (data) => {
                    if(data)
                        res.json({
                            code: status.OK,
                            msg: 'Se eliminó correctamente',
                            data: data
                        })
                    else 
                        res.status(status.NOT_FOUND)
                        .json({
                            code: status.NOT_FOUND,
                            msg: 'No se encontró el elemento'
                        })
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error en la petición',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    });

        /** Actualizar calificación */
        router.put('/:controlnumber', (req, res) => {
            ctrl = req.params.controlnumber;
            grde = req.body.grade;
            Escolares.findOneAndUpdate({controlnumber:ctrl},{grade:grde},{new:true})
                .then(
                    (data) => {
                        if(data)
                            res.json({
                                code: status.OK,
                                msg: 'Se actualizó correctamente',
                                data: data
                            })
                        else 
                            res.status(status.NOT_FOUND)
                            .json({
                                code: status.NOT_FOUND,
                                msg: 'No se encontró el elemento'
                            })
                    }
                )
                .catch(
                    (err) => {
                        res.status(status.BAD_REQUEST)
                            .json({
                                code: status.BAD_REQUEST,
                                msg: 'Error en la petición',
                                err: err.name,
                                detail: err.message
                            })
                    }
                )
        });

    
     /* Estadistica de aprobados y reprobados por carrera */
      router.get("/estadistica/aprobacion", (req, res) => {
        Escolares.aggregate([
          {
            $match: { grade: { $gte: 70 } },
          },
          {
            $group: {
              _id: "$career",
              count: { $sum: 1 },
            },
          },
        ])
          .then((aprobado) => {
            Escolares.aggregate([
              {
                $match: { grade: { $lt: 70 } },
              },
              {
                $group: {
                    _id: "$career",
                  count: { $sum: 1 },
                },
              },
            ])
              .then((noaprobado) => {
                res.json({
                  code: status.OK,
                  msg: "Estadistica",
                  noaprobados: noaprobado,
                  aprobados: aprobado,
                })
              })
              .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                  code: status.BAD_REQUEST,
                  msg: "Error en la petición",
                  err: err.name,
                  detail: err.message,
                })
              })
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            })
          })
      });


      /* Estadistica sexo por carrera */
      router.get("/estadistica/sexo", (req, res) => {
        Escolares.aggregate([
          {
            $match: { curp: /^.{10}[h,H].*/ },
          },
          {
            $group: {
              _id: "$career",
              count: { $sum: 1 },
            },
          },
        ])
          .then((hombre) => {
            Escolares.aggregate([
              {
                $match: { curp: /^.{10}[m,M].*/ },
              },
              {
                $group: {
                  _id: "$career",
                  count: { $sum: 1 },
                },
              },
            ])
              .then((mujer) => {
                res.json({
                  code: status.OK,
                  msg: "Estadistica",
                  hombres: hombre,
                  mujeres: mujer,
                });
              })
              .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                  code: status.BAD_REQUEST,
                  msg: "Error en la petición",
                  err: err.name,
                  detail: err.message,
                });
              });
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            })
          })
      });

      /* Estadistica foraneos por carrera */
      router.get("/estadistica/foraneos", (req, res) => {
        Escolares.aggregate([
          {
            $match: { curp: /^.{11}nt.*/ig },
          },
          {
            $group: {
              _id: "$career",
              count: { $sum: 1 },
            },
          },
        ])
          .then((local) => {
            Escolares.aggregate([
              {
                $match: { curp: /^.{11}(?!(nt)).*/ig },
              },
              {
                $group: {
                  _id: "$career",
                  count: { $sum: 1 },
                },
              },
            ])
              .then((foraneo) => {
                res.json({
                  code: status.OK,
                  msg: "Estadistica",
                  locales: local,
                  foraneos: foraneo,
                })
              })
              .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                  code: status.BAD_REQUEST,
                  msg: "Error en la petición",
                  err: err.name,
                  detail: err.message,
                })
              })
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            })
          })
      });

      /* Estadistica mayores y menores de edad por carrera */
      router.get("/estadistica/edad", (req, res) => {
        Escolares.aggregate([
        { $match: { curp: /(.{4}[0-9][0-9][0-9][0-9][0-9][0-9].{6}[0-9][0-9])|(.{4}[0][0-3][0-9][0-9][0-9][0-9].{6}[A-Z,a-z][0-9])/ } },
          { $group: { _id: "$career", count: { $sum: 1 } } },
        ])
          .then((mayor) => {
            Escolares.aggregate([
              { $match: { curp: /^(?!((.{4}[0-9][0-9][0-9][0-9][0-9][0-9].{6}[0-9][0-9])|(.{4}[0][0-3][0-9][0-9][0-9][0-9].{6}[A-Z,a-z][0-9])))/ } },
              { $group: { _id: "$career", count: { $sum: 1 } } },
            ])
              .then((menor) => {
                res.json({
                  code: status.OK,
                  msg: "Estadistica",
                  Mayores: mayor,
                  Menores: menor,
                });
              })
              .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                  code: status.BAD_REQUEST,
                  msg: "Error en la petición",
                  err: err.name,
                  detail: err.message,
                });
              });
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            });
          });
      });
    return router;
}