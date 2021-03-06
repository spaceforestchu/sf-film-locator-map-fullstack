import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import PropTypes from 'prop-types';
import validator from 'validator';
import { connect } from 'react-redux';
import { signUserUp } from '../../actions';

class SignupForm extends Component {
  Radio = props => {
    if (props && props.input && props.options) {
      const renderRadioButtons = (key, index) => {
        return (
          <label className="labelSpace" key={`${index}`} htmlFor={`${props.input.name}-${index}`}>
            <Field
              id={index}
              component="input"
              name={props.input.name}
              type="radio"
              value={key}
              className="labelSpace"
            />
            {props.options[key]}
          </label>
        )
      };
      return (
        <div>
          <div>
            {props.label}
          </div>
          <div className='radioHeight'>
            {props.options &&
              Object.keys(props.options).map(renderRadioButtons)}
          </div>
          <label className="labelColor" htmlFor="inputDanger1">
            {props.meta.submitFailed === false ?  '' : props.meta.error}
          </label>
        </div>
      );
    }
    return <div></div>
  }

  onSubmit = async (values) => {
    try {
      const result = await this.props.signUserUp(values);
      return result;
    } catch (error) {
      const errorMessage = error.toString();
      if (errorMessage.match(/Email/gi)) {
        const errorEmailIndex = errorMessage.indexOf('Email');
        const errorEmail = errorMessage.slice(errorEmailIndex, errorMessage.length - 1);
        throw new SubmissionError({ email: errorEmail });
      } else if (errorMessage.match(/Username/gi)) {
        const errorUserIndex = errorMessage.indexOf('Username');
        const errorUser = errorMessage.slice(errorUserIndex, errorMessage.length - 1);
        throw new SubmissionError({ username: errorUser });
      }
    }
  };

  CreateRenderer = render => (field) => {
    const {
      meta: {
        touched,
        error,
        input,
        label,
      },
    } = field;

    const fieldInput = field.input;
    const fieldLabel = field.label;
    const fieldType = field.type;
    const fieldChildren = field.children;

    const className = `form-group ${touched && error ? 'has-danger' : ''}`;
    return (
      <div className={className}>
        <label>{field.label}</label>
        {render(fieldInput, fieldLabel, fieldType, fieldChildren)}
        <label className="form-control-label" >
          {touched ? error : ''}
        </label>
      </div>
    );
  };

  renderInput = this.CreateRenderer((input, label, type) => {

    return (
      <input
        className="form-control"
        placeholder={label}
        type={type}
        {...input}
      />
    );
  });

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>
        <Field
          label="Full name"
          name="fullName"
          type="text"
          component={this.renderInput}
        />

        <Field
          label="Email"
          name="email"
          type="text"
          component={this.renderInput}
        />

        <Field
          label="Password"
          name="password"
          type="password"
          component={this.renderInput}
        />

        <Field
          label="Birthday"
          name="birthday"
          type="date"
          component={this.renderInput}
        />

        <Field
          label="Gender"
          name="gender"
          component={this.Radio}
          options={{
           male: 'male',
           female: 'female',
           trans: 'trans',
          }}
        />

        <Field
          label="Username"
          name="username"
          type="text"
          component={this.renderInput}
        />

        <button
          className="btn btn-outline-success my-2 my-sm-0"
          type="submit"
          disabled={this.props.submitting}
        >
          Submit
        </button>
        <button
          className="buttonSpace btn btn-outline-danger my-2 my-sm-0"
          type="submit"
          onClick={this.props.closeModal}
        >
          Cancel
        </button>
      </form>
    );
  }
}

const validate = (values) => {
  const errors = {};
  const { email } = values;
  const { password } = values;
  if (!values.fullName) {
    errors.fullName = 'Enter a fullname!';
  }

  if (!values.birthday) {
    errors.birthday = 'Enter a birthday!';
  }

  if (!values.email) {
    errors.email = 'Enter an email!';
  }

  if (email) {
    if (!validator.isEmail(email)) {
      errors.email = 'Enter an real email address please';
    }
  }

  if (!values.gender) {
    errors.gender = 'Select a gender!';
  }

  if (!password) {
    errors.password = 'Enter a password!';
  }

  if (password) {
    if (password.length < 8) {
      errors.password = 'Password must be 8 characters long';
    }
    if (password.length >= 8) {
      const strongRegex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
      const passwordValidator = password.match(strongRegex);
      if (passwordValidator === null) {
        errors.password = 'You must have one uppercase, one lowercase, a digit, and a symbol';
      }
    }
  }

  if (!values.username) {
    errors.username = 'Enter a username!';
  }

  return errors;
};

SignupForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  signUserUp: PropTypes.func.isRequired,
};

const dispatchToProps = (dispatch) => {
  return {
    signUserUp: (user) => dispatch(signUserUp(user)),
  };
};

export default SignupForm = reduxForm({
  validate,
  destroyOnUnmount: false,
  form: 'SignupForm',
})(connect(null, dispatchToProps)(SignupForm));

/*

<form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>
  <Field
    label="Full name"
    name="fullName"
    type="text"
    component={this.renderInput}
  />

  <Field
    label="Email"
    name="email"
    type="text"
    component={this.renderInput}
  />

  <Field
    label="Password"
    name="password"
    type="password"
    component={this.renderInput}
  />

  <Field
    label="Birthday"
    name="birthday"
    type="date"
    component={this.renderInput}
  />

  <Field
    label="Gender"
    name="gender"
    component={this.Radio}
    options={{
     male: 'male',
     female: 'female',
     trans: 'trans',
    }}
  />

  <Field
    label="Username"
    name="username"
    type="text"
    component={this.renderInput}
  />

  <button
    className="btn btn-outline-success my-2 my-sm-0"
    type="submit"
    disabled={this.props.submitting}
  >
    Submit
  </button>
  <button
    className="buttonSpace btn btn-outline-danger my-2 my-sm-0"
    type="submit"
    onClick={this.props.closeModal}
  >
    Cancel
  </button>
</form>

*/
