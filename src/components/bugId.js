import { Button, Comment, Divider, Form, Message } from 'semantic-ui-react'
import React, { Component } from 'react'
import $ from 'jquery'
import Moment from 'moment'

// this class implments the list of comments shown in the modal
class BugId extends Component {
    constructor (props) {
        super(props)

        // before we get any data, the modal's initial state is empty
        this.state = {
            bugId: '',
            id: this.props.id,
            route: this.props.route,
            bugIdButtonLoading: false,
            errorHidden: true,
            formText: '',
        }

        // bind event listeners
        this.formSubmitHandler = this.formSubmitHandler.bind(this)
        this.fetchData = this.fetchData.bind(this)
    }

    // fetches list of comments from server endpoint
    fetchData () {
        $.get('/db/' + this.state.route + '/' + this.state.id)
            .done(bugId => {
                this.setState({ bugId })
            })
            .fail(err => {
                console.log(err)
            })
    }

    // submits new comment
    formSubmitHandler (e) {
        e.preventDefault()
        this.setState({ bugIdButtonLoading: true }) // set ui loading

        // perform ajax request to add comment
        $.ajax({
            url: '/db/' + this.state.route + '/' + this.state.id,
            method: 'PUT',
            data: {
                bugId: this.state.formText,
            },
        })
            .then(() => {
                this.fetchData()
                this.setState({
                    formText: '',
                    errorHidden: true,
                    bugIdButtonLoading: false,
                })
            })
            .fail(() => {
                this.fetchData()
                this.setState({
                    errorHidden: false,
                    bugIdButtonLoading: false,
                })
            })
    }

    // fires before class is constructed, get initial data
    componentDidMount () {
        this.fetchData()
    }

    // renders view
    render () {
        var bug
        if (this.state.bugId === '') // if there are no bugs, render a msg
            bug = 'No bug Id posted yet'
        else // perform some formating on our list of comments
            bug = (
              <div>
                        <Comment.Text>
                            <p><strong>Bug ID: </strong>{this.state.bugId}</p><br />
                        </Comment.Text>
                      </div>
            )

        // finally, render our list of comments
        return (
            <Comment.Group>
                <Comment>
                    <Comment.Content>
                        {bug}
                    </Comment.Content>
                </Comment>

                { /* Error msg if either name or content is missing, initially hidden */ }
                <Message
                    hidden = {this.state.errorHidden}
                    error
                    content='Missing bug ID'
                />

                { /* form for submitted a new comment */ }
                <Form reply onSubmit= { this.formSubmitHandler } >
                    <Form.Field>
                        <label>Update Bug ID</label>
                        <Form.TextArea name='text'value={this.state.formText} onChange={e => {
                            this.setState({ formText: e.target.value })
                        }}/>
                    </Form.Field>

                    <Button content='Update Bug ID' labelPosition='left' icon='edit' type='submit' loading={this.state.bugIdButtonLoading} primary/>
                </Form>
            </Comment.Group>
        )
    }
}

export default BugId
