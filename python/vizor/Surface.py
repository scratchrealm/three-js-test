from typing import Tuple, Union
import numpy as np
import figurl as fig


class Surface:
    def __init__(self, *,
        vertices: np.ndarray,
        faces: np.ndarray,
        scalar_data: Union[np.array, None]=None,
        scalar_range: Union[Tuple[float, float], None]=None
    ) -> None:
        self.vertices = vertices
        self.faces = faces
        self.scalar_data = scalar_data
        self.scalar_range = scalar_range
    def url(self, *, label: str):
        d = {
            'type': 'vizor.Surface',
            'vertices': self.vertices.astype(np.float32),
            'faces': self.faces.astype(np.int32),
        }
        if self.scalar_data is not None:
            d['scalarData'] = self.scalar_data.astype(np.float32)
        if self.scalar_range is not None:
            d['scalarRange'] = [self.scalar_range[0], self.scalar_range[1]]
        F = fig.Figure(
            data=d,
            view_url='https://scratchrealm.github.io/vizor/v1'
        )
        return F.url(label=label)