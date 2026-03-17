import classNames from 'classnames';
import React, { useState } from 'react';
import { addComment } from '../api/api-comments';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';

type Props = {
  post: Post;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NewCommentForm: React.FC<Props> = ({
  post,
  setComments,
  setIsError,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [errorMessages, setErrorMessages] = useState<{
    nameError: boolean;
    emailError: boolean;
    bodyError: boolean;
  }>({ nameError: false, emailError: false, bodyError: false });
  const [loading, setLoading] = useState(false);

  function handleReset() {
    setName('');
    setEmail('');
    setBody('');
    setErrorMessages({ nameError: false, emailError: false, bodyError: false });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name !== '' && email !== '' && body !== '') {
      setLoading(true);
      try {
        const postFromServer = await addComment({
          postId: post.id,
          name,
          email,
          body,
        });

        setComments(prevComments => [...prevComments, postFromServer]);
        setBody('');
        setErrorMessages({
          nameError: false,
          emailError: false,
          bodyError: false,
        });
      } catch {
        setIsError(true);
        setBody(body);
      } finally {
        setLoading(false);
      }
    }

    if (!name) {
      setErrorMessages(prevErrors => ({ ...prevErrors, nameError: true }));
    }

    if (!email) {
      setErrorMessages(prevErrors => ({ ...prevErrors, emailError: true }));
    }

    if (!body) {
      setErrorMessages(prevErrors => ({ ...prevErrors, bodyError: true }));
    }
  }

  return (
    <form data-cy="NewCommentForm" onSubmit={event => handleSubmit(event)}>
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={classNames('input', {
              'is-danger': errorMessages.nameError,
            })}
            onChange={event => {
              setErrorMessages(prevErrors => ({
                ...prevErrors,
                nameError: false,
              }));
              setName(event.target.value);
            }}
            value={name}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {errorMessages.nameError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {errorMessages.nameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={classNames('input', {
              'is-danger': errorMessages.emailError,
            })}
            onChange={event => {
              setErrorMessages(prevErrors => ({
                ...prevErrors,
                emailError: false,
              }));
              setEmail(event.target.value);
            }}
            value={email}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {errorMessages.emailError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {errorMessages.emailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={classNames('input', {
              'is-danger': errorMessages.bodyError,
            })}
            onChange={event => {
              setErrorMessages(prevErrors => ({
                ...prevErrors,
                bodyError: false,
              }));
              setBody(event.target.value);
            }}
            value={body}
          />
        </div>

        {errorMessages.bodyError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button is-link', { 'is-loading': loading })}
          >
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            onClick={() => handleReset()}
            type="reset"
            className="button is-link is-light"
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
