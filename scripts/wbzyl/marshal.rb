
m = [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]

File.open('table.marshal', 'w')  { |f| Marshal.dump(m, f)   }
File.open('table.marshal', 'rb') { |f| mm = Marshal.load(f) }

## mm = Marshal.load(File.open('table.marshal'))
