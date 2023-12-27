import os
for f in os.listdir("."):
    if f.endswith("svg"):
        name = "16_basic_" + f
        os.rename(f, name)
