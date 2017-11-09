def unmarshal_dynamodb_json(node):
    data = dict({})
    data['M'] = node
    return _unmarshal_value(data)


def _unmarshal_value(node):
    if type(node) is not dict:
        print('not a dict!\n {}'.format(node))
        return node

    for key, value in node.items():
        # S – String - return string
        # N – Number - return int or float (if includes '.')
        # B – Binary - not handled
        # BOOL – Boolean - return Bool
        # NULL – Null - return None
        # M – Map - return a dict
        # L – List - return a list
        # SS – String Set - not handled
        # NN – Number Set - not handled
        # BB – Binary Set - not handled
        key = key.lower()
        if key == 'bool':
            return value
        elif key == 'null':
            return None
        elif key == 's':
            return value
        elif key == 'n':
            if '.' in str(value):
                return float(value)
            return int(value)
        elif key in ['m', 'l']:
            if key == 'm':
                data = {}
                print('m1')
                for key1, value1 in value.items():
                    print('m2')
                    if key1.lower() == 'l':
                        print('m2l1')
                        data = [_unmarshal_value(n) for n in value1]
                    else:
                        if type(value1) is not dict:
                            print('type: {}'.format(type(value1)))
                            print(value1)
                            print(value)
                            return _unmarshal_value(value)
                        data[key1] = _unmarshal_value(value1)
                        print('data: \n{}'.format(data))
                return data
            data = []
            for item in value:
                data.append(_unmarshal_value(item))
            return data
