import React, { Component } from "react";

class Customers extends Component {
  constructor() {
    super();
    this.state = { customers: [] };
  }

  componentDidMount() {
    fetch("/api/customers")
      .then(res => res.json())
      .then(customers =>
        this.setState({ customers }, () =>
          console.log("Customers fetched..", customers)
        )
      );
  }

  render() {
    return (
      <React.Fragment>
        <h3>Customers: Calling from Backend...</h3>
        <ul>
          {this.state.customers.map(customer => {
            return (
              <li key={customer.id}>
                {customer.firstName} {customer.lastName}
              </li>
            );
          })}
        </ul>
      </React.Fragment>
    );
  }
}

export default Customers;
