import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Styles/main.scss";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Pagination from "@material-ui/lab/Pagination";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, selectCountry] = useState("");
  const [selectedDate, handleDateChange] = useState("");
  const [selectname, setName] = useState("");
  const [current, setCurrent] = useState(1);
  const [something, setSomething] = useState([]);
  const [pagination, setPagination] = useState([]);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [Country, setCountry] = useState("");

  const [update, setUpdate] = useState(false);
  const [updateid, setUpdateid] = useState("");

  useEffect(() => {
    if (current > 1) {
      const value1 = (current - 1) * 10;
      const answer = something.slice(value1, current * 10);
      setPagination(answer);
    } else if (current === 1) {
      const answer = something.slice(0, 10);
      setPagination(answer);
    }
  }, [current, something]);

  const data = async () => {
    try {
      setLoading(false);
      const response = await axios.get("http://localhost:5000/users");
      const response_data = response.data;
      setLoading(true);
      setUsers(response_data);
      setSomething(response_data);
      setPagination(response_data.slice(0, 10));

      const get_countries = response_data.map((user) => user.Country);
      const filter_countries = [...new Set(get_countries)];
      setCountries(filter_countries);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    data();
  }, []);

  function filter() {
    let filter = users;
    if (country) {
      filter = filter.filter((user) => user.Country === country);
    }

    if (selectedDate) {
      filter = filter.filter((user) => {
        const date = user["Date of birth"].split("T")[0];
        return date === selectedDate;
      });
    }
    setSomething(filter);
  }

  function search() {
    let search = users;
    if (selectname) {
      search = search.filter(
        (user) => user["Full Name"].toLowerCase() === selectname.toLowerCase()
      );
      setSomething(search);
    }
  }

  function create() {
    axios
      .post("http://localhost:5000/users", {
        id: users.length + 1,
        Id: users.length + 1,
        "Full Name": fullname,
        Country: Country,
        Email: email,
        "Date of birth": dateofbirth,
        "Created at": new Date(),
      })
      .then(() => {
        data();
        setCountry("");
        setEmail("");
        setName("");
        setDateofbirth("");
        setFullname("");
      })
      .catch((error) => console.log(error));
  }

  function delete_user(id) {
    axios
      .delete(`http://localhost:5000/users/${id}`)
      .then((response) => {
        data();
      })
      .catch((error) => console.log(error));
  }

  function setUpdating(user, id) {
    console.log(user.id);
    setEmail(user["Email"]);
    setCountry(user["Country"]);
    setFullname(user["Full Name"]);
    setDateofbirth(user["Date of birth"].split("T")[0]);
    setUpdate(true);
    setUpdateid(user.Id);
    console.log(user);
  }

  function updating() {
    axios
      .put(`http://localhost:5000/users/${updateid}`, {
        id: updateid,
        Id: updateid,
        "Full Name": fullname,
        Country: Country,
        Email: email,
        "Date of birth": dateofbirth,
      })
      .then(() => {
        data();
        setCountry("");
        setEmail("");
        setName("");
        setFullname("");
        setDateofbirth("");
        setUpdate(false);
        setUpdateid("");
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <header className="header">
        <section className="filter">
          <h3>FILTER</h3>
          <FormControl className="filter_form">
            <InputLabel id="filter_input">Select Country</InputLabel>
            <Select
              labelId="filter_input"
              value={country}
              onChange={(e) => selectCountry(e.target.value)}
            >
              {countries &&
                countries.map((each_country, index) => (
                  <MenuItem key={index} value={each_country}>
                    {each_country}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            label="Date of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={() => filter()}>
            Select
          </Button>
        </section>
        <section className="search">
          <h3>SEARCH</h3>
          <TextField
            label="Full Name"
            value={selectname}
            onChange={(e) => setName(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={search}>
            SELECT
          </Button>
        </section>
      </header>
      <div className="reset">
        <Button variant="contained" color="primary" onClick={() => data()}>
          RESET
        </Button>
      </div>
      {!loading && <h2 style={{ textAlign: "center" }}>Loading......</h2>}
      <section className="display_user">
        {pagination.length === 0 && (
          <h2 style={{ textAlign: "center" }}>No data</h2>
        )}
        {pagination &&
          pagination.map((user, index) => {
            return (
              <>
                <div className="display">
                  <h4>Name:{user["Full Name"]}</h4>
                  <h4>Email:{user["Email"]}</h4>
                  <h4>Date of Birth:{user["Date of birth"].split("T")[0]}</h4>
                  <h4>Country:{user["Country"]}</h4>
                  <Button onClick={() => setUpdating(user, user.Id)}>
                    Update
                  </Button>
                  <Button onClick={() => delete_user(user.Id)}>Delete</Button>
                </div>
              </>
            );
          })}
      </section>

      <section className="pagination">
        <Pagination
          count={Math.ceil(something.length / 10)}
          page={current}
          onChange={(event, value) => {
            setCurrent(value);
          }}
        />
      </section>
      <form className="form">
        <h3>FORM</h3>
        <TextField
          className="inputs"
          label="Full Name"
          value={fullname}
          id="fullname"
          onChange={(e) => setFullname(e.target.value)}
        />
        <TextField
          className="inputs"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControl className="country">
          <InputLabel id="form_input">Select Country</InputLabel>
          <Select
            labelId="form_input"
            value={Country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {countries &&
              countries.map((each_country, index) => (
                <MenuItem key={index} value={each_country}>
                  {each_country}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          className="inputs"
          label="Date of Birth"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateofbirth}
          onChange={(e) => setDateofbirth(e.target.value)}
        />
        {!update && (
          <Button
            className="inputs"
            variant="contained"
            color="primary"
            onClick={() => create()}
          >
            CREATE
          </Button>
        )}
        {update && (
          <Button
            className="inputs"
            variant="contained"
            color="primary"
            onClick={() => updating()}
          >
            UPDATE
          </Button>
        )}
      </form>
    </>
  );
}
