import React, { useState, useEffect, ChangeEvent } from 'react';
import { makeStyles, createStyles, Select, MenuItem, Grid, FormControl, InputLabel, Input, Chip, Theme, useTheme, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Container, Typography } from '@material-ui/core';
import { Loader } from '../../components/Loader';

export const StatsPage = () => {
  const classes = useStyles();
  const theme = useTheme();

  //states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [authors, setAuthors ] = useState<string[]>(['all']);
  const [personName, setPersonName] = useState<string[]>([]);
  const [stats, setStats] = useState<Object>();


  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
      PaperProps: {
          style: {
              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
              width: 250,
          },
      },
  };

  const getStyles = (name: string, personName: string[], theme: Theme) => {
      return {
          fontWeight:
              personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
      };
  }

  
  //
  // handlers
  //

  const handleChange = (
    event: ChangeEvent<{ value: unknown }>
  ) => {
    (event.target.value as string[]).indexOf('all') === -1 ? setPersonName(event.target.value as string[]) : setPersonName(['all'])
  };

  const handleButton = () => {
    setPersonName([])
  }


  //
  // requests / fetches
  //

  const fetchAuthors = async() => {
    setLoading(true);
    await fetch('http://localhost:8080/authors/')
      .then(res => res.json())
      .then(data => {
        let _aut = [authors[0]] as string[];
        Object.values(data).map(name => _aut.push(name as string))
        setLoading(false);
        setAuthors(_aut);
      })
      .catch(e => setError(true))
  }

  const fetchStats = async() => {
    setLoading(true);
    await fetch('http://localhost:8080/stats/')
      .then(res => res.json())
      .then(data => {
        fetchHelper(data);
      })
      .catch(e => setError(true))
  }

  const fetchStatsAuthor = async (aut: string) => {
    setLoading(true);
    await fetch(`http://localhost:8080/stats/${aut.toLowerCase().replace(' ', '')}`)
      .then(res => res.json())
      .then(data => {
        fetchHelper(data);
      })
      .catch(e => setError(true))
  }

  const fetchStatsAuthors = async (persons: string[]) => {
    setLoading(true);
    let _statsWords = [] as string[];
    let _statsValues = [] as number[];
    let _result = {} as any;
    let sorted = [] as any;

    persons.map(async (person, index) => {
      await fetch(`http://localhost:8080/stats/${person.toLowerCase().replace(' ', '')}`)
        .then(res => res.json())
        .then(data => {
          // eslint-disable-next-line
          Object.entries(data).map(([key, value]) => {
            if (_statsWords.indexOf(key) !== -1) {
              _statsValues[_statsWords.indexOf(key)] += value as number;
            }
            else {
              _statsWords.push(key as string);
              _statsValues.push(value as number);
            }
          })
        })
        .catch(e => setError(true))
      _statsWords.forEach((key, i) => (_result[key] = _statsValues[i]));
      sorted = Object.entries(_result)
        .sort((a: any, b: any) => a[1] - b[1])
        .reverse()
        .slice(0, 10);
      if (index === persons.length - 1) {
        setLoading(false);
        setStats(sorted);
      }
    })
  }

  const fetchHelper = (data: Object) => {
    let _statsWords = [] as string[];
    let _statsValues = [] as number[];
    let _obj = {} as any;
    let sorted = [] as any;


    Object.values(data).map(value => _statsValues.push(value as number))
    Object.keys(data).map(word => _statsWords.push(word as string))
    _statsWords.forEach((key, i) => _obj[key] = _statsValues[i]);
    sorted = Object.entries(_obj)
      .sort((prev: any, curr: any) => prev[1] - curr[1])
      .reverse()
      .slice(0, 10);
    setLoading(false)
    setStats(sorted)
  }


  //
  // useEffects
  //
  
  useEffect(() => {
    fetchAuthors();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (personName[0] === 'all' || personName.length >= 14)
      fetchStats();
    else if (personName.length === 1 && personName[0] !== 'all')
      fetchStatsAuthor(personName[0]);
    else if (personName.length > 1) {
      fetchStatsAuthors(personName)
    }
    else {
     setStats({})
    }
    // eslint-disable-next-line
  }, [personName])


  //
  // render
  //

  return (
      !error && authors ? (
          <>
              <Grid className={classes.rootGrid} container direction="row">
                  <Grid item lg={4} />
                  <Grid item lg={4}>
                      <FormControl fullWidth className={classes.formControl}>
                          <InputLabel id="mutiple-chip-label">Authors</InputLabel>
                          <Select
                              labelId="mutiple-chip-label"
                              id="mutiple-chip"
                              multiple
                              value={personName}
                              onChange={handleChange}
                              input={<Input id="select-multiple-chip" />}
                              renderValue={(selected) => (
                                  <div className={classes.chips}>
                                      {(selected as string[]).map((value) => (
                                          <Chip key={value} label={value} className={classes.chip} />
                                      ))}
                                  </div>
                              )}
                              MenuProps={MenuProps}
                          >
                              {authors.map((name) => (
                                  <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                                      {name}
                                  </MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                      <Button onClick={handleButton}>Clear</Button>
                  </Grid>
                  <Grid item lg={4} />
              </Grid>
              {!loading && stats && (
                  <Grid className={classes.tableGrid} container direction="row">
                      <Grid item lg={4} />
                      <Grid item lg={4}>
                          <TableContainer component={Paper}>
                              <Table className={classes.table} aria-label="simple table">
                                  <TableHead>
                                      <TableRow>
                                          <TableCell>Word</TableCell>
                                          <TableCell align="right">Count</TableCell>
                                      </TableRow>
                                  </TableHead>
                                  <TableBody>
                                      {Object.entries(stats).map(key => (
                                          <TableRow>
                                              <TableCell 
                                                component="th" 
                                                scope="row"
                                              >
                                                {key[1][0]}
                                              </TableCell>
                                              <TableCell 
                                                align="right"
                                              >
                                                {key[1][1]}
                                              </TableCell>
                                          </TableRow>
                                      ))}
                                  </TableBody>
                              </Table>
                          </TableContainer>
                      </Grid>
                      <Grid item lg={4} />
                  </Grid>
              )}
              {loading && <Loader />}
          </>
      ) : (
        <Container>
          <Typography>
            Error...
          </Typography>
          <Typography>
            If u want continue please refresh page (F5)
          </Typography>
        </Container>
      )
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rootGrid: {
      padding: '1vw'
    },
    tableGrid: {
      paddingTop: '1vw'
    },
    formControl: {

    },
    chips: {
      
    },
    chip: {

    },
    table : {
      
    }
  })
)
