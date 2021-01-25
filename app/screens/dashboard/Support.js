import React from 'react'
import { TextInput, StyleSheet, View, Text } from 'react-native'
import { connect } from 'react-redux'
import { notificationIcon } from '../../assets'
import { Button, IconButton } from '../../components/Button'
import Header from '../../components/Header'
import colors from '../../constants/colors'
import env from '../../constants/env'
import { getFAQs, addComplain, rootLoader } from '../../actions'
import { DropDownInput, TextareaWithLimit } from '../../components/InputField'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import AlertDialog from '../../components/Dialog/AlertDialog'


class Support extends React.Component {

  constructor() {
    super()

    this.state = {
      selection: '',
      faqs: null
    }
  }

  componentDidMount() {
    this.initData()
  }

  initData = async () => {
    if (this.props.user?.user_type === 2) {
      const res = await getFAQs()
      if (res.status) {
        this.setState({ faqs: res.data })
      }
    }
  }

  _submit = async () => {
    const { selection, message } = this.state

    if (!selection) return this.showAlert('Please select issue')
    else if (!message) return this.showAlert('Please enter message')
    const requestParams = {
      issue: selection,
      description: message
    }
    this.props.rootLoader(true)
    let res = await this.props.addComplain(requestParams)
    this.props.rootLoader(false)
    setTimeout(() => {
      this.showAlert(res.message)
    }, 350);
    if (res.status)
      this.setState({
        message: ''
      })
  }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }

  render() {
    const { faqs } = this.state

    let headerTitle = 'Report a complain'

    if (this.props.user?.user_type === 2) {
      headerTitle = 'Support'
    }

    return (
      <View style={styles.root}>
        <Header
          title={headerTitle}
        />
        <View style={styles.container}>

          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
          >
            {
              faqs && this.props.user?.user_type === 2 && (
                <>
                  {faqs.map(this.renderFAQ)}
                  <View style={{ backgroundColor: '#DCDCE3', height: 5, marginTop: -1 }} />
                </>
              )
            }

            <View margin={20}>
              <Text style={styles.kareTitleText}>We Kare</Text>
              <Text style={styles.kareDescText}>Is it a issue with:</Text>

              <DropDownInput
                items={[
                  { label: 'Is the item durable', value: '1' },
                  { label: 'Is this item easy to use', value: '2' },
                  { label: 'What are the dimensions', value: '3' },
                ]}
                placeholder='Select'
                // defaultValue={this.state.selection}
                onChangeItem={item => this.setState({ selection: item.label })}
              />

              <View style={{ height: 20 }} />
              <TextareaWithLimit
                placeholder='Write your message...'
                value={this.state.message}
                onChangeText={(text) => this.setState({ message: text })}
              />

            </View>

            <View style={{ marginVertical: 40, width: '70%', alignSelf: 'center' }}>
              <Button
                title='Submit'
                onPress={this._submit}
              />
            </View>

          </KeyboardAwareScrollView>

        </View>
        <AlertDialog
          isVisible={this.state.alert}
          message={this.state.alertMessage}
          onAction={() => this.setState({ alert: false })}
        />

      </View>
    )
  }

  renderFAQ = (item, index) => {
    return (
      <View
        key={String(index)}
        style={{ padding: 20, borderBottomColor: '#DCDCE3', borderBottomWidth: 3 }}
      >
        <Text style={styles.titleText}>{index + 1}. {item.question}</Text>
        <Text style={styles.descText}>{item.answer}</Text>
      </View>
    )
  }
}

function mapStateToProps({ user }) {
  return {
    user: user.currentUser
  }
}

export default connect(mapStateToProps, {
  addComplain,
  rootLoader
})(Support)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden'
  },
  titleText: {
    fontFamily: env.fontPoppinsSemiBold,
    fontSize: 16,
    color: colors.black,
    flex: 1
  },
  descText: {
    fontFamily: env.fontPoppinsRegular,
    fontSize: 15,
    color: colors.black,
    opacity: 0.5
  },
  kareTitleText: {
    fontFamily: env.fontSemiBold,
    fontSize: 20,
    color: colors.blueLight,
    marginTop: 10
  },
  kareDescText: {
    fontFamily: env.fontMedium,
    fontSize: 15,
    color: colors.lightBlack,
    marginVertical: 10
  }
})
