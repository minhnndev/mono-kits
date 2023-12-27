print("Enter string: ")
key_name = []
while True:
    key = input()
    if key:
        key_name.append(key)
    else:
        break

parse = []
suffix = ": { \"uri\": \"https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/"
# print(suffix)
for i in range(len(key_name)):
    name = "\"" + key_name[i] + "\""
    parse.append(name)

print("{")
for j in range(len(parse)):
    print(parse[j], suffix, key_name[j], ".png\" },", sep='')
print("}")
