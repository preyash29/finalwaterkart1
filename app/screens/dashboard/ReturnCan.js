import React, { Component } from 'react'
import { View, StyleSheet, Text, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'
import { hambargIcon, notificationIcon } from '../../assets'
import { Button, IconButton } from '../../components/Button'
import colors from '../../constants/colors'
import env from '../../constants/env'
import InputField, { DropDownInput } from '../../components/InputField'
import ReturnCanDialog from '../../components/Dialog/ReturnCanDialog'
import Header from '../../components/Header'
import { getSuppliers, addReturnCan, rootLoader } from '../../actions'
import AlertDialog from '../../components/Dialog/AlertDialog'

class ReturnCan extends Component {
  constructor() {
    super()

    this.state = {
      size: '',
      supplierId: '',
      numberOfCan: ''
    }
  }

  componentDidMount() {
    this.props.getSuppliers()
  }

  _return = async () => {
    const { size, supplierId, numberOfCan } = this.state

    if (!supplierId) return this.showAlert('Please select company name')
    else if (!numberOfCan) return this.showAlert('Please enter number of can')
    const requestParams = {
      supplier_id: supplierId,
      total_can: numberOfCan,
      can_size: size
    }
    this.props.rootLoader(true)
    let res = await this.props.addReturnCan(requestParams)
    this.props.rootLoader(false)
    setTimeout(() => {
      this.showAlert(res.message)
    }, 350);
    if (res.status)
      this.setState({
        size: '',
        supplierId: '',
        numberOfCan: ''
      })
  }

  showAlert = (message) => {
    this.setState({ alert: true, alertMessage: message })
  }

  render() {
    let supplierData = []
    if (this.props.supplierList) {
      this.props.supplierList.map(item => {
        supplierData.push({ label: item.name, value: item.id })
      })
    }
    return (
      <View style={styles.root}>

        <Header
          title='Return Can'
        />
        <View style={styles.container}>

          <View style={{ width: '70%' }}>
            <InputField
              placeholder='Number of empty can you have'
              value={this.state.numberOfCan}
              onChangeText={(text) => this.setState({ numberOfCan: text })}
            />
             <DropDownInput
                placeholder='Company name'
                items={supplierData}
                onChangeItem={item => this.setState({ supplierId: item.value })}
              />
          </View>
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 / 3 }}>
              <DropDownInput
                placeholder='Can size'
                items={[{ label: '10', value: 10 }, { label: '20', value: 20 }, { label: '30', value: 30 }, { label: '40', value: 40 }, { label: '50', value: 50 }]}
                // defaultValue={this.state.size}
                onChangeItem={item => this.setState({ size: item.value })}
              />
            </View>
            <View style={{ width: 30 }} />
            <View style={{ flex: 1.5 / 3 }}>
              <DropDownInput
                placeholder='Company name'
                items={supplierData}
                // defaultValue={this.state.supplierId}
                onChangeItem={item => this.setState({ supplierId: item.value })}
              />
            </View>
          </View> */}

          <Text style={{ fontFamily: env.fontMedium, color: '#747474', fontSize: 14, marginVertical: 25 }}>(Note * : T his will be your last order with us and you are suppose to return the can and you will get back your deposite amount)</Text>

          <View style={{ width: '70%', alignSelf: 'center', marginTop: 30 }}>
            <Button
              title='Return can'
              onPress={this._return}
            />
          </View>

        </View>

        {/* Hidden Components */}
        {/* <ReturnCanDialog
          isVisible={this.state.returnDialog}
          onClose={() => this.setState({ returnDialog: false })}
          returnAction={() => this.setState({ returnDialog: false })}
        /> */}
        <AlertDialog
          isVisible={this.state.alert}
          message={this.state.alertMessage}
          onAction={() => this.setState({ alert: false })}
        />

      </View>
    )
  }
}

function mapStateToProps({ user }) {
  return {
    supplierList: user.supplierList
  }
}

export default connect(mapStateToProps, {
  getSuppliers,
  addReturnCan,
  rootLoader
})(ReturnCan)

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
    overflow: 'hidden',
    padding: 30
  }

})
