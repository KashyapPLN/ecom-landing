import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './landingpage.css';

export default function LandingPage() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
          axios.get('https://fakestoreapi.com/products')
          .then(response => {
            setProducts(response.data);
          })
          .catch(error => {
            console.error('Error fetching the products:', error);
          });
      }, []);
      const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
      });
    
      const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
      };
    
  return (
    <Container className="my-4">
      <h1 className="text-center">ECommerce Store</h1>

      {/* Search Bar */}
      <Row>
        <Col md={4} sm={12}>
        <Form.Control
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
        </Col>
      </Row>
    

      {/* Category Filter */}
      <Row>
      <Col md={3} sm={12}>
      <Form.Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mb-3"
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="jewelery">Jewelery</option>
        <option value="men's clothing">Men's Clothing</option>
        <option value="women's clothing">Women's Clothing</option>
      </Form.Select>
      </Col>
      </Row>

      {/* Product Grid */}
      <Row>
        {filteredProducts.map(product => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="h-100">
              <Card.Img variant="top" src={product.image} alt={product.title} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{product.title}</Tooltip>}
                >
                  <Card.Title className="product-title">{product.title}</Card.Title>
                </OverlayTrigger>
                <Card.Text>${product.price.toFixed(2)}</Card.Text>
                <Button variant="primary" onClick={() => handleProductClick(product)}>View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={selectedProduct?.image} alt={selectedProduct?.title} className="img-fluid mb-3" />
          <p><strong>Description:</strong> {selectedProduct?.description}</p>
          <p><strong>Price:</strong> ${selectedProduct?.price.toFixed(2)}</p>
          <p><strong>Available Quantity:</strong> {selectedProduct?.rating?.count}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
