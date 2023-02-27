# 2/27/23
# https://figurl.org/f?v=https://scratchrealm.github.io/vizor/v1&d=sha1://c0c49470953b2df6059ceef5ee485647dda48dd0&label=example%20vizor%20surface

import numpy as np
import vizor as vi
import kachery_cloud as kcl

n = 6
vertices = np.zeros((n * 4, 3), dtype=np.float32)
faces = np.zeros((n * 3, 3), dtype=np.int32)
for j in range(n):
    i_v = j * 4
    i_f = j * 3
    x0 = j * 3
    y0 = 0
    z0 = 0
    vertices[i_v + 0, :] = [x0, y0, z0]
    vertices[i_v + 1, :] = [x0 + 2, y0, z0]
    vertices[i_v + 2, :] = [x0, y0 + 4, z0]
    vertices[i_v + 3, :] = [x0 - 2, y0 - 3, z0 + 4]
    faces[i_f + 0, :] = [i_v, i_v + 1, i_v + 2]
    faces[i_f + 1, :] = [i_v, i_v + 1, i_v + 3]
    faces[i_f + 2, :] = [i_v, i_v + 2, i_v + 3]

num_frames = 20
with kcl.TemporaryDirectory() as tmpdir:
    fname = f'{tmpdir}/scalar_data.dat'
    with open(fname, 'wb') as f:
        for ii in range(num_frames):
            frame_data = np.zeros((n * 4,), dtype=np.float32)
            for j in range(n):
                i_v = j * 4
                frame_data[i_v + 0] = (j + ii) % n
                frame_data[i_v + 1] = (j + ii) % n
                frame_data[i_v + 2] = (j + ii) % n
                frame_data[i_v + 3] = (j + ii) % n
            f.write(frame_data.tobytes())
    scalar_data_uri = kcl.store_file(fname)

scalar_range = [0, n - 1]
X = vi.DynamicSurface(
    vertices=vertices,
    faces=faces,
    num_frames=num_frames,
    scalar_data_type='float32',
    scalar_data_uri=scalar_data_uri,
    scalar_range=scalar_range
)
url = X.url(label='example vizor surface')
print(url)